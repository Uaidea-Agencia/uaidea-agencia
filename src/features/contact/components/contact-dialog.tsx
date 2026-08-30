"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion, type Variants } from "motion/react";
import { startTransition, useActionState, useEffect, useId, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

import { submitContactAction } from "../actions";
import { formatBRPhone } from "../phone-mask";
import {
  CONSENT_STATEMENT,
  contactSchema,
  SERVICE_OPTIONS,
  type ContactFormValues,
} from "../schema";
import { CONTACT_IDLE_STATE } from "../types";

const fieldsContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
};

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 420, damping: 24, mass: 0.6 },
  },
};

interface ContactDialogProps {
  label: string;
  mailtoHref: string;
}

export function ContactDialog({ label, mailtoHref }: ContactDialogProps) {
  const [open, setOpen] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const reduceMotion = useReducedMotion();
  const formId = useId();

  const [state, formAction, isPending] = useActionState(submitContactAction, CONTACT_IDLE_STATE);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      empresa: "",
      mensagem: "",
      consentimento: false,
    },
  });

  useEffect(() => {
    if (state.status === "success") {
      toast.success("Mensagem enviada. A gente responde em breve.");
      form.reset();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(false);
    } else if (state.status === "error") {
      if (state.fieldErrors) {
        for (const [field, message] of Object.entries(state.fieldErrors)) {
          form.setError(field as keyof ContactFormValues, { type: "server", message });
        }
      }
      toast.error(
        state.message ??
          `Não deu pra enviar. Manda direto pra ${mailtoHref.replace("mailto:", "")}.`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function onValid() {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
          setStartedAt(Date.now());
        } else {
          form.reset();
        }
      }}
    >
      <DialogTrigger
        nativeButton={false}
        className={buttonVariants({ size: "xl" })}
        render={
          // eslint-disable-next-line jsx-a11y/anchor-has-content
          <a
            href={mailtoHref}
            onClick={(event) => {
              event.preventDefault();
            }}
          />
        }
      >
        {label}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>Falar com a UAIdea</DialogTitle>
          <DialogDescription>
            Manda o contexto do seu negócio. A gente devolve um diagnóstico com o que faríamos
            primeiro — e por quê.
          </DialogDescription>
        </DialogHeader>

        <form
          ref={formRef}
          id={formId}
          onSubmit={(event) => {
            void form.handleSubmit(onValid)(event);
          }}
          noValidate
          className="flex flex-col gap-4"
        >
          <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="website">Não preencha este campo</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <input type="hidden" name="startedAt" value={startedAt ?? ""} readOnly />

          <motion.div
            className="flex flex-col gap-4"
            variants={fieldsContainerVariants}
            initial={reduceMotion ? "visible" : "hidden"}
            animate="visible"
          >
            <motion.div variants={fieldVariants}>
              <Field data-invalid={!!form.formState.errors.nome}>
                <FieldLabel htmlFor="nome">Nome</FieldLabel>
                <Input
                  id="nome"
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  autoComplete="name"
                  aria-invalid={!!form.formState.errors.nome}
                  {...form.register("nome")}
                />
                <FieldError errors={[form.formState.errors.nome]} />
              </Field>
            </motion.div>

            <motion.div variants={fieldVariants} className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!form.formState.errors.email}>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!form.formState.errors.email}
                  {...form.register("email")}
                />
                <FieldError errors={[form.formState.errors.email]} />
              </Field>

              <Field data-invalid={!!form.formState.errors.telefone}>
                <FieldLabel htmlFor="telefone">Telefone (opcional)</FieldLabel>
                <Input
                  id="telefone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="(31) 91234-5678"
                  aria-invalid={!!form.formState.errors.telefone}
                  {...form.register("telefone", {
                    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                      event.target.value = formatBRPhone(event.target.value);
                    },
                  })}
                />
                <FieldError errors={[form.formState.errors.telefone]} />
              </Field>
            </motion.div>

            <motion.div variants={fieldVariants}>
              <Field data-invalid={!!form.formState.errors.empresa}>
                <FieldLabel htmlFor="empresa">Empresa (opcional)</FieldLabel>
                <Input id="empresa" autoComplete="organization" {...form.register("empresa")} />
                <FieldError errors={[form.formState.errors.empresa]} />
              </Field>
            </motion.div>

            <motion.div variants={fieldVariants}>
              <Field data-invalid={!!form.formState.errors.servico}>
                <FieldLabel htmlFor="servico">Serviço de interesse</FieldLabel>
                <Controller
                  control={form.control}
                  name="servico"
                  render={({ field }) => (
                    <Select
                      name={field.name}
                      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                      value={field.value ?? null}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger
                        id="servico"
                        className="w-full"
                        aria-invalid={!!form.formState.errors.servico}
                      >
                        <SelectValue placeholder="Escolha uma frente" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICE_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={[form.formState.errors.servico]} />
              </Field>
            </motion.div>

            <motion.div variants={fieldVariants}>
              <Field data-invalid={!!form.formState.errors.mensagem}>
                <FieldLabel htmlFor="mensagem">Mensagem</FieldLabel>
                <Textarea
                  id="mensagem"
                  rows={4}
                  aria-invalid={!!form.formState.errors.mensagem}
                  {...form.register("mensagem")}
                />
                <FieldError errors={[form.formState.errors.mensagem]} />
              </Field>
            </motion.div>

            <motion.div variants={fieldVariants}>
              <Controller
                control={form.control}
                name="consentimento"
                render={({ field }) => (
                  <Field data-invalid={!!form.formState.errors.consentimento}>
                    <div className="flex items-start gap-2.5">
                      <Checkbox
                        id="consentimento"
                        name={field.name}
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                        }}
                        aria-invalid={!!form.formState.errors.consentimento}
                        className="mt-0.5"
                      />
                      <FieldLabel htmlFor="consentimento" className="text-sm font-normal">
                        {CONSENT_STATEMENT}
                      </FieldLabel>
                    </div>
                    <FieldError errors={[form.formState.errors.consentimento]} />
                  </Field>
                )}
              />
            </motion.div>
          </motion.div>

          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending ? "Enviando…" : "Enviar mensagem"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

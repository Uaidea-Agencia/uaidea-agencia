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
import { contactSchema, SERVICE_OPTIONS, type ContactFormValues } from "../schema";
import { CONTACT_IDLE_STATE } from "../types";

// "Peça assentando no lugar": stagger de ~70ms entre campos, pequeno
// overshoot de mola. Só transform e opacity (docs/ui-web.md).
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

/**
 * Diálogo de contato — substitui o CTA "Falar com a UAIdea →" que hoje é
 * mailto puro. O mailto continua existindo no <a> real: sem JS, o clique
 * navega normalmente; com JS, o clique é interceptado e o diálogo abre.
 */
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

  // Reage ao resultado da Server Action (useActionState), não a um evento
  // síncrono do usuário — é exatamente o caso de uso que useEffect existe
  // pra cobrir ("subscribe pra updates de um sistema externo").
  useEffect(() => {
    if (state.status === "success") {
      toast.success("Mensagem enviada. A gente responde em breve.");
      form.reset();
      // eslint-disable-next-line react-hooks/set-state-in-effect -- fechar o diálogo é reação ao resultado assíncrono da action, não deriva de outro estado
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- só reage a novo resultado da action, não a form/mailtoHref
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
          // Timestamp fresco a cada abertura — alimenta a verificação de
          // tempo mínimo de preenchimento no servidor (actions.ts).
          setStartedAt(Date.now());
        } else {
          form.reset();
        }
      }}
    >
      <DialogTrigger
        nativeButton={false}
        className={buttonVariants({ size: "lg" })}
        render={
          // O conteúdo vem do children de DialogTrigger (padrão render-prop
          // do Base UI: children viram o conteúdo do elemento renderizado)
          // — o linter estático não enxerga essa composição neste <a>.
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
          {/* Honeypot — escondido de gente, visível pra bot que preenche tudo. */}
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
                  // Exceção deliberada à regra geral: isto é o primeiro
                  // campo de um diálogo modal que a pessoa acabou de abrir
                  // por um clique — não autofoco de carregamento de página.
                  // eslint-disable-next-line jsx-a11y/no-autofocus -- requisito de acessibilidade do Prompt 6: foco no primeiro campo na abertura do modal
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
                      // O tipo de field.value (via ContactInput/zod) não
                      // inclui undefined porque "servico" é obrigatório no
                      // schema — mas defaultValues não o inicializa, então
                      // no primeiro render ele É undefined em runtime.
                      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ver comentário acima
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
                        Aceito que a UAIdea entre em contato comigo pra responder esta mensagem.
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

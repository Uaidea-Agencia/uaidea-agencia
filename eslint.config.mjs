import js from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";
import jsxA11y from "eslint-plugin-jsx-a11y";
import perfectionist from "eslint-plugin-perfectionist";
import { globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

const eslintConfig = tseslint.config(
  // Ignora build output e artefatos gerados antes de qualquer outra regra.
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "node_modules/**"]),

  js.configs.recommended,
  ...nextVitals,
  ...nextTs,

  // Regras type-aware do typescript-eslint, restritas a arquivos TS —
  // eslint.config.mjs e outros .mjs/.js não entram no programa do tsconfig.
  {
    files: ["**/*.{ts,tsx}"],
    extends: [...tseslint.configs.strictTypeChecked, ...tseslint.configs.stylisticTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      // next/core-web-vitals registra o plugin react-hooks com exhaustive-deps
      // em "warn" — endurecemos para "error" por decisão do projeto.
      "react-hooks/exhaustive-deps": "error",
      // number em template literal é comum e seguro (delay de animação,
      // valor de CSS) — não vale exigir String(n) em todo lugar.
      "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
    },
  },

  // Conjunto completo recomendado de acessibilidade (o preset do Next só
  // traz um subconjunto de 6 regras em "warn"). Só as regras — o plugin
  // "jsx-a11y" já é registrado por eslint-config-next/core-web-vitals, e
  // registrá-lo de novo aqui quebra o flat config ("Cannot redefine
  // plugin").
  {
    rules: jsxA11y.flatConfigs.recommended.rules,
  },

  // Ordenação determinística de imports. Só a regra de imports do
  // perfectionist — não o preset inteiro, que também reordena chaves de
  // objeto, props de JSX etc., o que seria ruído demais numa base nova.
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs}"],
    plugins: { perfectionist },
    rules: {
      "perfectionist/sort-imports": [
        "error",
        {
          type: "natural",
          order: "asc",
          newlinesBetween: 1,
          internalPattern: ["^@/.+"],
        },
      ],
    },
  },

  // src/components/ui/ é a pasta "vendorizada" pelo shadcn (`shadcn add`
  // sobrescreve os arquivos nela). O Label de lá é um primitivo genérico —
  // a associação com o controle (htmlFor/id) é responsabilidade de quem
  // consome o componente, não da definição em si, então a regra dispara
  // falso positivo aqui. Desligada só nesta pasta; em qualquer outro lugar
  // do código continua valendo normalmente.
  {
    files: ["src/components/ui/**"],
    rules: {
      "jsx-a11y/label-has-associated-control": "off",
    },
  },

  // Prettier por último: desliga qualquer regra de estilo que conflite
  // com o formatador.
  eslintConfigPrettier,
);

export default eslintConfig;

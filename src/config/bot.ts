const specialKey = "";
export type CommandsType = "info" | "help" | "phrase" | "payment";
interface ICommandsConfig {
  command: string;
  description: string;
  regex: RegExp;
}
export const commands: Record<CommandsType, ICommandsConfig> = {
  info: {
    command: "/info",
    description: "Informações do rôbo",
    regex: new RegExp(`\/${specialKey}\w*(info|sobre)`, "i"),
  },
  help: {
    command: "/help",
    description: "Como usar",
    regex: new RegExp(`\/${specialKey}\w*(help|ajuda|socorro)`, "i"),
  },
  phrase: {
    command: "/phrase",
    description: "Retorna frase aleatória",
    regex: new RegExp(`\/${specialKey}\w*(phrase|frase)`, "i"),
  },
  payment: {
    command: "/payment",
    description: "Pagamento de serviço",
    regex: new RegExp(`\/${specialKey}\w*(payment|pagamento)`, "i"),
  },
};

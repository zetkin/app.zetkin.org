interface CSSStyleSheet {
  addRule(selector?: string, style?: string, index?: number): number;
  deleteRule(index: number);
  insertRule(rule: string, index?: number): number;
  removeRule(index?: number);
  replace(resetStyle: string | CSSStyleSheet): Promise<void>;
  replaceSync(resetStyle: string | CSSStyleSheet): void;
  readonly cssRules: CSSRuleList;
  readonly ownerRule: CSSRule | null;
  readonly rules: CSSRuleList;
}

export interface Navigation {
  title: string;
  path?: string;
  icon?: string;
  children?: Navigation[];
  opened?: boolean;
  active?: boolean;
}

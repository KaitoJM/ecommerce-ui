export type AttributeSelection = "radio" | "dropdown" | "color";

export interface Attribute {
  id: string;
  attribute: string;
  selection_type: AttributeSelection;
  created_at: string;
}

export interface AttributeListItem {
  id: string;
  attribute: string;
  selection_type: AttributeSelection;
  created_at: string;
}

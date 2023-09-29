declare interface CreateUpdateAttributeBody {
  name: string;
  is_required: boolean;
  is_multiple_choice: boolean;
}

declare interface AttributeItem {
  id: number;
  name: string;
  is_required: boolean;
  is_multiple_choice: boolean;
}

declare interface Attribute extends AttributeItem {}

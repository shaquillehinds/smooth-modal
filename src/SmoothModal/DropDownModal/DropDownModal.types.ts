export type StringNumber = string | number;
//prettier-ignore
export type DropDownValue<T extends StringNumber  = StringNumber> = T;
//prettier-ignore
export type DropDownItemValue<T extends StringNumber  = StringNumber> =  T;

export type DropDownItem<T extends StringNumber = StringNumber> = {
  label: string;
  value: DropDownItemValue<T>;
};
export type DropDownSelectorProps<T extends StringNumber = StringNumber> = {
  items: DropDownItem<T>[];
  setItems: React.Dispatch<React.SetStateAction<DropDownItem<T>[]>>;
  value: DropDownValue<T>;
  setValue: React.Dispatch<React.SetStateAction<DropDownValue<T>>>;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

export type DropDownModalProps<T extends DropDownValue = DropDownValue> = {
  title: string;
  items: DropDownItem<T>[];
  selectedItem: T;
  onSelect: (item: T) => void;
  placeholder: string;
  isDisabled?: boolean;
};

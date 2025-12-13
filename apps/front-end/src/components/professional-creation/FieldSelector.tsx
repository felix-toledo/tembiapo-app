import { Field } from "@tembiapo/db";

export function FieldSelector({
  setField,
  fields,
}: {
  setField: (field: string) => void;
  fields: Field[];
}) {
  return (
    <div>
      <h2>Field Selector</h2>
      {fields.map((field) => (
        <div key={field.id} onClick={() => setField(field.name)}>
          {field.name}
        </div>
      ))}
    </div>
  );
}

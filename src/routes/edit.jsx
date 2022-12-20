import { Form, useLoaderData, redirect, useNavigate } from "react-router-dom";
import { updateContact } from "../pages/Contacts";

//atualizando contato com FormData
export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
}

export default function EditContact() {
  const contact = useLoaderData();
  const navigate = useNavigate();

  return (
    <Form method="post" id="contact-form">
      <p>
        <span>Nome</span>
        <input
          type="text"
          placeholder="Primeiro"
          aria-label="Primeiro nome"
          name="first"
          defaultValue={contact.first}
        />
        <input
          type="text"
          placeholder="Segundo nome"
          aria-label="Segundo nome"
          name="last"
          defaultValue={contact.last}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          placeholder="@jack"
          name="twitter"
          defaultValue={contact.twitter}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          type="text"
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          name="avatar"
          defaultValue={contact.avatar}
        />
      </label>
      <label>
        <span>Notas</span>
        <textarea name="notes" defaultValue={contact.notes} rows={6}></textarea>
      </label>
      <p>
        <button type="submit">Salvar</button>
        <button
          type="button"
          onClick={() => {
            navigate(-1);
          }}
        >
          Cancelar
        </button>
      </p>
    </Form>
  );
}

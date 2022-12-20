import { redirect } from "react-router-dom";
import { deleteContact } from "../pages/Contacts";

export async function action({ params }) {
  await deleteContact(params.contactId);
  return redirect("/");
}
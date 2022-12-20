import { useEffect } from "react";
import {
  Outlet,
  useLoaderData,
  Form,
  redirect,
  NavLink,
  useNavigation,
  useSubmit,
} from "react-router-dom";
// carregando dados
import { getContacts, createContact } from "../pages/Contacts";

/*Criar contatos => altarar o form method="post" para Form. depois importa e define a ação na rota import Root, {
  loader as rootLoader,
  action as rootAction,
} from "./routes/root"; que quando clicado no botão acionará a function action() e criará um novo contato*/
export async function action() {
  const contact = await createContact();
  //redireciona para a pagina de edição quando clicar em novo
  return redirect(`/contacts/${contact.id}/edit`);
}

// carregando dados e mostra o valor procurado na url enquanto digita
export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts, q };
}

export default function Root() {
  const { contacts, q } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();

  //botão giratório de pesquisa
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1>React Router contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching ? "loading" : ""}
              name="q"
              aria-label="Procurar contato"
              placeholder="Procurar"
              type="search"
              defaultValue={q}
              onChange={(event) => {
                const isFirstSearch = q == null;
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch,
                });
              }}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            <button type="submit">Novo</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  {/* roteamento do lado do cliente permite que a aplicação atualize a URL sem solicitar outro doumento ao servidor. Em vez disso, renderiza a aplicação imediatamente, para isso basta utilizar o <Link></Link> em vez da tag <a></a>.( ao clicar no link <a></a> a aplicação o navegador solicita um documento completo para a proxima URL em vez de usar o React Router) */}
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>Sem nome</i>
                    )}
                    {""}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>Sem contato</p>
          )}
        </nav>
      </div>
      <div
        className={navigation.state === "loading" ? "loading" : ""}
        id="detail"
      >
        {/* indica onde a rota Children deve ser renderizada */}
        <Outlet />
      </div>
    </>
  );
}

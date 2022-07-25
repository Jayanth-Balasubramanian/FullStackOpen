// -- This is a parent command --
Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3003/api/login', {
    username, password,
  }).then(({ body }) => {
    localStorage.setItem('loggedBlogAppUser', JSON.stringify(body));
    cy.visit('http://localhost:3000');
  });
});

Cypress.Commands.add('createUser', (userObject) => {
  cy.request(
    'POST',
    'http://localhost:3000/api/users',
    userObject,
  );
});

Cypress.Commands.add('createBlog', (blogObject) => {
  cy.request({
    url: 'http://localhost:3003/api/blogs',
    method: 'POST',
    body: blogObject,
    headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('loggedBlogAppUser')).token}` },
  });
  cy.visit('http://localhost:3000');
});

//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

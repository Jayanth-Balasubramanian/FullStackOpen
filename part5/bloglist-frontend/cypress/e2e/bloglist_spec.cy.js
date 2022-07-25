/* eslint-disable func-names */
describe('Bloglist App', function () {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    const testUser = {
      name: 'test',
      username: 'test',
      password: 'test',
    };
    cy.createUser(testUser);
    cy.visit('http://localhost:3000');
  });

  it('login form is shown', function () {
    cy.contains('username');
    cy.contains('password');
    cy.contains('login');
  });

  describe('Login', function () {
    it('succeeds with valid credentials', function () {
      cy.get('#username').type('test');
      cy.get('#password').type('test');
      cy.get('#login-button').click();
      cy.contains('test logged in');
    });

    it('fails with invalid credentials and displays error in red', function () {
      cy.get('#username').type('test');
      cy.get('#password').type('wrongPassword');
      cy.get('#login-button').click();
      cy.get('.error')
        .should('contain', 'Wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid');
      cy.get('html').should('not.contain', 'test logged in');
    });
  });

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({
        username: 'test', password: 'test',
      });
    });
    const mockBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    };

    it('A new blog can be created', function () {
      cy.contains('create new blog').click();
      cy.get('#title').type(mockBlog.title);
      cy.get('#author').type(mockBlog.author);
      cy.get('#url').type(mockBlog.url);
      cy.contains('submit').click();
      cy.contains(mockBlog.title);
      cy.contains(mockBlog.author);
    });

    describe('and blogs exist', function () {
      beforeEach(function () {
        const initialBlogs = [
          {
            title: 'React patterns',
            author: 'Michael Chan',
            url: 'https://reactpatterns.com/',
          },
          {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
          },
          {
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
          },
        ];

        initialBlogs.forEach((blog) => cy.createBlog(blog));
      });

      it('it can be liked', function () {
        cy.contains('React patterns').parent().find('button').as('viewButton');
        cy.get('@viewButton').click();
        cy.contains('like').click();
        cy.contains('likes 1');
      });

      it('it can be deleted by the creator', function () {
        cy.contains('React patterns').parent().as('blogToDelete');
        cy.get('@blogToDelete').find('#view-button').click();
        cy.contains('delete').click();
        cy.on('window:alert', () => true);
        cy.get('#root');
        cy.should('not.contain', 'React patterns');
      });

      it('it cannot be deleted by a different user', function () {
        const newUser = {
          username: 'test2',
          name: 'test2',
          password: 'test',
        };
        cy.createUser(newUser);
        cy.login(newUser);
        cy.contains('React patterns').parent().as('blogToDelete');
        cy.get('@blogToDelete').find('#view-button').click();
        cy.get('@blogToDelete').should('not.contain', 'delete');
      });

      it('they are sorted in decreasing order of likes', function () {
        cy.contains('React patterns').parent().as('blog1');
        cy.contains('Canonical').parent().as('blog2');
        cy.contains('Go To').parent().as('blog3');

        cy.get('@blog1').find('#view-button').click();
        cy.get('@blog1').contains('like').click();
        cy.get('@blog1').contains('likes 1');

        cy.get('@blog2').find('#view-button').click();
        cy.get('@blog2').contains('like').click();
        cy.get('@blog2').contains('likes 1');
        cy.get('@blog2').contains('like').click();
        cy.get('@blog2').contains('likes 2');

        cy.get('.blog').eq(0).should('contain', 'Canonical');
        cy.get('.blog').eq(1).should('contain', 'React patterns');
        cy.get('.blog').eq(2).should('contain', 'Go To');
      });
    });
  });
});

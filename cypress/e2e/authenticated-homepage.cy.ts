describe('Authenticated Homepage Tests', () => {
    const apiUrl = 'https://your-api-endpoint.com';

    beforeEach(() => {
        cy.login(); // Assuming you have a login command
    });

    it('should load the authenticated homepage', () => {
        cy.visit('/homepage');
        cy.url().should('include', '/homepage');
    });

    it('should check profile API', () => {
        cy.request(`${apiUrl}/profile`).then((response) => {
            expect(response.status).to.eq(200);
            // Add more assertions based on expected profile structure
        });
    });

    it('should test limit settings', () => {
        cy.request(`${apiUrl}/limit-settings`).then((response) => {
            expect(response.status).to.eq(200);
            // Validate limit settings response
        });
    });

    it('should verify site settings', () => {
        cy.request(`${apiUrl}/site-settings`).then((response) => {
            expect(response.status).to.eq(200);
            // Check site settings structure and values
        });
    });

    it('should handle popups', () => {
        cy.get('.popup-selector').should('be.visible'); // Adjust selector as needed
    });

    it('should display promotions', () => {
        cy.get('.promotions-selector').should('have.length.greaterThan', 0);
    });

    it('should list games', () => {
        cy.request(`${apiUrl}/games`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
        });
    });

    it('should fetch game records', () => {
        cy.request(`${apiUrl}/game-records`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
        });
    });
});
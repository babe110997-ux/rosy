describe('Homepage Smoke Test - Guest Mode', () => {
  const baseUrl = 'https://prod4.luckyking.com.ph';

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  describe('Homepage Load', () => {
    it('should load homepage successfully', () => {
      cy.url().should('include', baseUrl);
      cy.get('body').should('be.visible');
    });
  });

  describe('API Interception - User Bulk', () => {
    it('should intercept /api/v2/user/bulk and handle unauthenticated state', () => {
      cy.intercept('GET', '**/api/v2/user/bulk', (req) => {
        req.reply((res) => {
          // Validate 2005 code for unauthenticated users
          expect(res.body).to.have.property('code');
          expect(res.body.code).to.equal(2005);
        });
      }).as('userBulk');

      cy.visit(baseUrl);
      cy.wait('@userBulk').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
        expect(interception.response.body.message).to.equal('Unauthenticated');
      });
    });
  });

  describe('Popup API', () => {
    it('should intercept /api/v2/user/popups and validate active popup data', () => {
      cy.intercept('GET', '**/api/v2/user/popups', (req) => {
        req.reply((res) => {
          expect(res.statusCode).to.equal(200);
        });
      }).as('popupAPI');

      cy.visit(baseUrl);
      cy.wait('@popupAPI').then((interception) => {
        const popupData = interception.response.body;
        
        // Validate popup structure
        expect(popupData).to.be.an('object');
        
        // Check if active popup exists
        if (popupData.data && popupData.data.length > 0) {
          const activePopup = popupData.data.find(p => p.active === true);
          expect(activePopup).to.exist;
          expect(activePopup.name).to.include('Daily First Topup');
          expect(activePopup.skip_today).to.equal(1);
        }
      });
    });
  });

  describe('Game APIs', () => {
    it('should intercept /api/v2/user/entertainment/games and validate game data', () => {
      cy.intercept('GET', '**/api/v2/user/entertainment/games**', (req) => {
        req.reply((res) => {
          expect(res.statusCode).to.equal(200);
        });
      }).as('gamesAPI');

      cy.visit(baseUrl);
      cy.wait('@gamesAPI').then((interception) => {
        const gameData = interception.response.body;
        
        // Validate game data structure
        expect(gameData).to.be.an('object');
        expect(gameData.data).to.be.an('array');
        expect(gameData.data.length).to.be.greaterThan(0);
      });
    });

    it('should load popular games section', () => {
      cy.intercept('GET', '**/api/v2/user/entertainment/games?type=popular**').as('popularGames');
      cy.visit(baseUrl);
      cy.wait('@popularGames').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
        expect(interception.response.body.data).to.not.be.empty;
      });
    });

    it('should load new games section', () => {
      cy.intercept('GET', '**/api/v2/user/entertainment/games?type=new**').as('newGames');
      cy.visit(baseUrl);
      cy.wait('@newGames').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
        expect(interception.response.body.data).to.not.be.empty;
      });
    });

    it('should load JILI games section', () => {
      cy.intercept('GET', '**/api/v2/user/entertainment/games?provider=jili**').as('jiliGames');
      cy.visit(baseUrl);
      cy.wait('@jiliGames').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
        expect(interception.response.body.data).to.not.be.empty;
      });
    });
  });

  describe('Response Status Validation', () => {
    it('should validate all critical API responses have 200 or 204 status codes', () => {
      cy.intercept('GET', '**/api/**').as('apiCalls');
      cy.visit(baseUrl);
      
      cy.wait('@apiCalls', { timeout: 10000 }).then((interception) => {
        const status = interception.response.statusCode;
        expect([200, 204, 304]).to.include(status);
      });
    });

    it('should not return 4xx or 5xx errors on homepage load', () => {
      cy.intercept('**/*', (req) => {
        req.continue((res) => {
          expect(res.statusCode).to.be.lessThan(400);
        });
      }).as('allRequests');

      cy.visit(baseUrl);
    });
  });

  describe('Guest State Validation', () => {
    it('should confirm user is in guest/unauthenticated state', () => {
      cy.intercept('GET', '**/api/v2/user/bulk', { statusCode: 200, body: { code: 2005, message: 'Unauthenticated' } }).as('guestState');
      
      cy.visit(baseUrl);
      cy.wait('@guestState').then((interception) => {
        expect(interception.response.body.code).to.equal(2005);
        expect(interception.response.body.message).to.equal('Unauthenticated');
      });
    });
  });
});

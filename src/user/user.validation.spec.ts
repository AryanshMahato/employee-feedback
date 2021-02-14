import {
  GetUserValidationParams,
  GetUserValidationQuery,
  SignInRequestBody,
  SignUpRequestBody,
} from './user.validation';
import { validateOrReject, ValidationError } from 'class-validator';

describe('GetUserValidationParams', () => {
  describe('When proper testId is passed', () => {
    it('should not throw any error', async () => {
      const getUserValidationParams = new GetUserValidationParams();
      getUserValidationParams.userId = 'testId';

      await validateOrReject(getUserValidationParams);
      expect.anything();
    });
  });

  describe('When testId is not passed', () => {
    it('should throw error', async () => {
      try {
        const getUserValidationParams = new GetUserValidationParams();

        await validateOrReject(getUserValidationParams);
        expect('There should be an error').toBeFalsy();
      } catch (e) {
        expect(e).toBeInstanceOf(Array);

        if (Array.isArray(e)) {
          e.forEach((e) => {
            expect(e).toBeInstanceOf(ValidationError);
          });
        }
      }
    });
  });
});

describe('GetUserValidationQuery', () => {
  describe('When valid methods are passed', () => {
    it('should not throw any error', async () => {
      const getUserValidationQuery = new GetUserValidationQuery();
      getUserValidationQuery.method = 'username';

      await validateOrReject(getUserValidationQuery);
      expect.anything();
    });

    it('should not throw any error', async () => {
      const getUserValidationQuery = new GetUserValidationQuery();
      getUserValidationQuery.method = 'email';

      await validateOrReject(getUserValidationQuery);
      expect.anything();
    });
  });

  describe('When invalid method is passed', () => {
    it('should throw validation error', async () => {
      try {
        const getUserValidationQuery = new GetUserValidationQuery();
        // @ts-ignore
        getUserValidationQuery.method = 'invalid';

        await validateOrReject(getUserValidationQuery);
        expect('There should be an error').toBeFalsy();
      } catch (e) {
        expect(e).toBeInstanceOf(Array);

        if (Array.isArray(e)) {
          e.forEach((e) => {
            expect(e).toBeInstanceOf(ValidationError);
          });
        }
      }
    });
  });

  describe('When empty string is passed as method', () => {
    it('should throw validation error', async () => {
      try {
        const getUserValidationQuery = new GetUserValidationQuery();
        // @ts-ignore
        getUserValidationQuery.method = '';

        await validateOrReject(getUserValidationQuery);
        expect('There should be an error').toBeFalsy();
      } catch (e) {
        expect(e).toBeInstanceOf(Array);

        if (Array.isArray(e)) {
          e.forEach((e) => {
            expect(e).toBeInstanceOf(ValidationError);
          });
        }
      }
    });
  });
});

describe('SignUpRequestBody', () => {
  describe('When all valid fields are passed', () => {
    it('should not throw any error', async () => {
      const signUpRequestBody = new SignUpRequestBody();
      signUpRequestBody.firstName = 'Steve';
      signUpRequestBody.lastName = 'Rogers';
      signUpRequestBody.username = 'CaptainAmerica';
      signUpRequestBody.email = 'steve@avengers.com';
      signUpRequestBody.password = 'I can do this all day';
      signUpRequestBody.confirmPassword = 'I can do this all day';

      await validateOrReject(signUpRequestBody);
      expect.anything();
    });
  });

  describe('When invalid firstName is passed', () => {
    it('should throw validation error', async () => {
      try {
        const signUpRequestBody = new SignUpRequestBody();
        signUpRequestBody.firstName = '@Steve';
        signUpRequestBody.lastName = 'Rogers';
        signUpRequestBody.username = 'CaptainAmerica';
        signUpRequestBody.email = 'steve@avengers.com';
        signUpRequestBody.password = 'I can do this all day';
        signUpRequestBody.confirmPassword = 'I can do this all day';

        await validateOrReject(signUpRequestBody);
        expect('There should be an error').toBeFalsy();
      } catch (e) {
        expect(e).toBeInstanceOf(Array);

        if (Array.isArray(e)) {
          e.forEach((e) => {
            expect(e).toBeInstanceOf(ValidationError);
          });
        }
      }
    });
  });

  describe('When invalid lastName is passed', () => {
    it('should throw validation error', async () => {
      try {
        const signUpRequestBody = new SignUpRequestBody();
        signUpRequestBody.firstName = 'Steve';
        signUpRequestBody.lastName = '@Rogers';
        signUpRequestBody.username = 'CaptainAmerica';
        signUpRequestBody.email = 'steve@avengers.com';
        signUpRequestBody.password = 'I can do this all day';
        signUpRequestBody.confirmPassword = 'I can do this all day';

        await validateOrReject(signUpRequestBody);
        expect('There should be an error').toBeFalsy();
      } catch (e) {
        expect(e).toBeInstanceOf(Array);

        if (Array.isArray(e)) {
          e.forEach((e) => {
            expect(e).toBeInstanceOf(ValidationError);
          });
        }
      }
    });
  });

  describe('When invalid username is passed', () => {
    it('should throw validation error', async () => {
      try {
        const signUpRequestBody = new SignUpRequestBody();
        signUpRequestBody.firstName = 'Steve';
        signUpRequestBody.lastName = 'Rogers';
        signUpRequestBody.username = 'Captain America';
        signUpRequestBody.email = 'steve@avengers.com';
        signUpRequestBody.password = 'I can do this all day';
        signUpRequestBody.confirmPassword = 'I can do this all day';

        await validateOrReject(signUpRequestBody);
        expect('There should be an error').toBeFalsy();
      } catch (e) {
        expect(e).toBeInstanceOf(Array);

        if (Array.isArray(e)) {
          e.forEach((e) => {
            expect(e).toBeInstanceOf(ValidationError);
          });
        }
      }
    });
  });

  describe('When invalid email is passed', () => {
    it('should throw validation error', async () => {
      try {
        const signUpRequestBody = new SignUpRequestBody();
        signUpRequestBody.firstName = 'Steve';
        signUpRequestBody.lastName = 'Rogers';
        signUpRequestBody.username = 'CaptainAmerica';
        signUpRequestBody.email = 'steveAvengers.com';
        signUpRequestBody.password = 'I can do this all day';
        signUpRequestBody.confirmPassword = 'I can do this all day';

        await validateOrReject(signUpRequestBody);
        expect('There should be an error').toBeFalsy();
      } catch (e) {
        expect(e).toBeInstanceOf(Array);

        if (Array.isArray(e)) {
          e.forEach((e) => {
            expect(e).toBeInstanceOf(ValidationError);
          });
        }
      }
    });
  });

  describe('When different password and confirm password is passed', () => {
    it('should throw validation error', async () => {
      try {
        const signUpRequestBody = new SignUpRequestBody();
        signUpRequestBody.firstName = 'Steve';
        signUpRequestBody.lastName = 'Rogers';
        signUpRequestBody.username = 'CaptainAmerica';
        signUpRequestBody.email = 'steve@avengers.com';
        signUpRequestBody.password = 'I can do this all day';
        signUpRequestBody.confirmPassword = 'I love you 3000';

        await validateOrReject(signUpRequestBody);
        expect('There should be an error').toBeFalsy();
      } catch (e) {
        expect(e).toBeInstanceOf(Array);

        if (Array.isArray(e)) {
          e.forEach((e) => {
            expect(e).toBeInstanceOf(ValidationError);
          });
        }
      }
    });
  });

  describe('When small password and confirm password is passed', () => {
    it('should throw validation error', async () => {
      try {
        const signUpRequestBody = new SignUpRequestBody();
        signUpRequestBody.firstName = 'Steve';
        signUpRequestBody.lastName = 'Rogers';
        signUpRequestBody.username = 'CaptainAmerica';
        signUpRequestBody.email = 'steve@avengers.com';
        signUpRequestBody.password = 'ca';
        signUpRequestBody.confirmPassword = 'ca';

        await validateOrReject(signUpRequestBody);
        expect('There should be an error').toBeFalsy();
      } catch (e) {
        expect(e).toBeInstanceOf(Array);

        if (Array.isArray(e)) {
          e.forEach((e) => {
            expect(e).toBeInstanceOf(ValidationError);
          });
        }
      }
    });
  });

  describe('When all empty string is passed', () => {
    it('should throw validation error', async () => {
      try {
        const signUpRequestBody = new SignUpRequestBody();
        signUpRequestBody.firstName = '';
        signUpRequestBody.lastName = '';
        signUpRequestBody.username = '';
        signUpRequestBody.email = '';
        signUpRequestBody.password = '';
        signUpRequestBody.confirmPassword = '';

        await validateOrReject(signUpRequestBody);
        expect('There should be an error').toBeFalsy();
      } catch (e) {
        expect(e).toBeInstanceOf(Array);

        if (Array.isArray(e)) {
          e.forEach((e) => {
            expect(e).toBeInstanceOf(ValidationError);
          });
        }
      }
    });
  });

  describe('When nothing is passed', () => {
    it('should throw validation error', async () => {
      try {
        const signUpRequestBody = new SignUpRequestBody();

        await validateOrReject(signUpRequestBody);
        expect('There should be an error').toBeFalsy();
      } catch (e) {
        expect(e).toBeInstanceOf(Array);

        if (Array.isArray(e)) {
          e.forEach((e) => {
            expect(e).toBeInstanceOf(ValidationError);
          });
        }
      }
    });
  });
});

describe('SignInRequestBody', () => {
  describe('When all valid fields are passed', () => {
    it('should not throw any error', async () => {
      const signInRequestBody = new SignInRequestBody();
      signInRequestBody.username = 'CaptainAmerica';
      signInRequestBody.email = 'steve@avengers.com';
      signInRequestBody.password = 'I can do this all day';
      signInRequestBody.type = 'username';

      await validateOrReject(signInRequestBody);
      expect.anything();
    });
  });

  describe('When one of username or email is missing', () => {
    it('should not throw any error', async () => {
      const signInRequestBody = new SignInRequestBody();
      signInRequestBody.username = 'CaptainAmerica';
      signInRequestBody.password = 'I can do this all day';
      signInRequestBody.type = 'username';

      await validateOrReject(signInRequestBody);
      expect.anything();
    });

    it('should not throw any error', async () => {
      const signInRequestBody = new SignInRequestBody();
      signInRequestBody.email = 'steve@avengers.com';
      signInRequestBody.password = 'I can do this all day';
      signInRequestBody.type = 'email';

      await validateOrReject(signInRequestBody);
      expect.anything();
    });
  });

  describe('When invalid username is passed', () => {
    it('should throw validation error', async () => {
      try {
        const signInRequestBody = new SignInRequestBody();
        signInRequestBody.username = 'Captain America';
        signInRequestBody.email = 'steve@avengers.com';
        signInRequestBody.password = 'I can do this all day';
        signInRequestBody.type = 'username';

        await validateOrReject(signInRequestBody);
        expect('There should be an error').toBeFalsy();
      } catch (e) {
        expect(e).toBeInstanceOf(Array);

        if (Array.isArray(e)) {
          e.forEach((e) => {
            expect(e).toBeInstanceOf(ValidationError);
          });
        }
      }
    });
  });

  describe('When invalid email is passed', () => {
    it('should throw validation error', async () => {
      try {
        const signInRequestBody = new SignInRequestBody();
        signInRequestBody.username = 'CaptainAmerica';
        signInRequestBody.email = 'steveAvengers.com';
        signInRequestBody.password = 'I can do this all day';
        signInRequestBody.type = 'username';

        await validateOrReject(signInRequestBody);
        expect('There should be an error').toBeFalsy();
      } catch (e) {
        expect(e).toBeInstanceOf(Array);

        if (Array.isArray(e)) {
          e.forEach((e) => {
            expect(e).toBeInstanceOf(ValidationError);
          });
        }
      }
    });
  });

  describe('When small password is passed', () => {
    it('should throw validation error', async () => {
      try {
        const signInRequestBody = new SignInRequestBody();
        signInRequestBody.username = 'CaptainAmerica';
        signInRequestBody.email = 'steve@avengers.com';
        signInRequestBody.password = 'ca';
        signInRequestBody.type = 'username';

        await validateOrReject(signInRequestBody);
        expect('There should be an error').toBeFalsy();
      } catch (e) {
        expect(e).toBeInstanceOf(Array);

        if (Array.isArray(e)) {
          e.forEach((e) => {
            expect(e).toBeInstanceOf(ValidationError);
          });
        }
      }
    });
  });
  describe('When invalid is passed', () => {
    it('should throw validation error', async () => {
      try {
        const signInRequestBody = new SignInRequestBody();
        signInRequestBody.username = 'CaptainAmerica';
        signInRequestBody.email = 'steve@avengers.com';
        signInRequestBody.password = 'I can do this all day';
        // @ts-ignore
        signInRequestBody.type = 'invalid';

        await validateOrReject(signInRequestBody);
        expect('There should be an error').toBeFalsy();
      } catch (e) {
        expect(e).toBeInstanceOf(Array);

        if (Array.isArray(e)) {
          e.forEach((e) => {
            expect(e).toBeInstanceOf(ValidationError);
          });
        }
      }
    });
  });

  describe('When all empty string is passed', () => {
    it('should throw validation error', async () => {
      try {
        const signInRequestBody = new SignInRequestBody();
        signInRequestBody.username = '';
        signInRequestBody.email = '';
        signInRequestBody.password = '';
        // @ts-ignore
        signInRequestBody.type = '';

        await validateOrReject(signInRequestBody);
        expect('There should be an error').toBeFalsy();
      } catch (e) {
        expect(e).toBeInstanceOf(Array);

        if (Array.isArray(e)) {
          e.forEach((e) => {
            expect(e).toBeInstanceOf(ValidationError);
          });
        }
      }
    });
  });

  describe('When nothing is passed', () => {
    it('should throw validation error', async () => {
      try {
        const signInRequestBody = new SignInRequestBody();

        await validateOrReject(signInRequestBody);
        expect('There should be an error').toBeFalsy();
      } catch (e) {
        expect(e).toBeInstanceOf(Array);

        if (Array.isArray(e)) {
          e.forEach((e) => {
            expect(e).toBeInstanceOf(ValidationError);
          });
        }
      }
    });
  });
});

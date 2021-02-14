import {
  GetUserValidationParams,
  GetUserValidationQuery,
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

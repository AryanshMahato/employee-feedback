import { GetUserValidationParams } from './user.validation';
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
        // getUserValidationParams.userId = 'testId';

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

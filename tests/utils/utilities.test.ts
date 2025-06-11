import { describe, test, expect } from 'vitest';
import { filterItems, getNestedValue } from '../../src/utils/dashboard/dashboardUtils';
import { roleMapping } from '../../src/utils/dictionary';

// Type definitions for test data
interface TestUser {
  name: string;
  email: string;
}

interface NestedTestObject {
  user: {
    profile: {
      name: string;
      settings?: {
        theme: string;
      };
    };
  };
  data?: {
    items: any[];
  };
}

interface RoleMapping {
  [key: string]: string;
}

describe('Utility Functions', () => {
  describe('Dashboard Utils', () => {
    test('filterItems filters array correctly', () => {
      const items: TestUser[] = [
        { name: 'John', email: 'john@example.com' },
        { name: 'Jane', email: 'jane@example.com' },
        { name: 'Bob', email: 'bob@test.com' }
      ];

      const filtered = filterItems(items, 'john', ['name', 'email']);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('John');
    });

    test('getNestedValue retrieves nested object values', () => {
      const obj: NestedTestObject = {
        user: {
          profile: {
            name: 'Test User'
          }
        }
      };

      const value = getNestedValue(obj, 'user.profile.name');
      expect(value).toBe('Test User');
    });

    test('getNestedValue returns undefined for non-existent path', () => {
      const obj: { user: { name: string } } = { user: { name: 'Test' } };
      const value = getNestedValue(obj, 'user.profile.name');
      expect(value).toBeUndefined();
    });
  });

  describe('Dictionary Utils', () => {
    test('roleMapping contains expected roles', () => {
      const mapping = roleMapping as RoleMapping;
      expect(mapping).toHaveProperty('PATIENT');
      expect(mapping).toHaveProperty('DENTIST');
      expect(mapping).toHaveProperty('CLINIC_ADMIN');
      expect(mapping.PATIENT).toBe('Patient');
      expect(mapping.DENTIST).toBe('Dentist');
    });

    test('roleMapping has correct number of roles', () => {
      const roles: string[] = Object.keys(roleMapping);
      expect(roles.length).toBeGreaterThan(0);
    });
  });
});

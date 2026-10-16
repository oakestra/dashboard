import { CleanJsonService } from './clean-json.service';

describe('CleanJsonService', () => {
    describe('cleanData', () => {
        it('should remove empty nested objects from a plain object', () => {
            const input = { a: 1, b: {}, c: { d: 'x' } };

            const result = CleanJsonService.cleanData(input);

            expect(result).toEqual({ a: 1, c: { d: 'x' } });
        });

        it('should remove empty nested objects from an array', () => {
            const input = [{ a: 1 }, {}, { b: 2 }];

            const result = CleanJsonService.cleanData(input);

            expect(result).toEqual([{ a: 1 }, { b: 2 }]);
        });

        it('should leave primitives and non-empty structures untouched', () => {
            const input = { a: 1, b: 'text', c: [1, 2, 3] };

            const result = CleanJsonService.cleanData(input);

            expect(result).toEqual({ a: 1, b: 'text', c: [1, 2, 3] });
        });
    });

    describe('deleteEmptyValues', () => {
        it('should return falsy input unchanged', () => {
            expect(CleanJsonService.deleteEmptyValues(null as any)).toBeNull();
        });

        it('should delete keys with empty string values', () => {
            const input = { name: '', port: 8080 };

            const result = CleanJsonService.deleteEmptyValues(input);

            expect(result).toEqual({ port: 8080 });
        });

        it('should keep the microservices key even when empty', () => {
            const input: Record<string, any> = { microservices: [] };

            const result = CleanJsonService.deleteEmptyValues(input);

            expect(result).toEqual({ microservices: [] });
        });

        it('should filter out empty strings from array values', () => {
            const input = { tags: ['a', '', 'b'] };

            const result = CleanJsonService.deleteEmptyValues(input);

            expect(result).toEqual({ tags: ['a', 'b'] });
        });

        it('should drop a key entirely when its array becomes empty', () => {
            const input = { tags: [''] };

            const result = CleanJsonService.deleteEmptyValues(input);

            expect(result).toEqual({});
        });
    });
});

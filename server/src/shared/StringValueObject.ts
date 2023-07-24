// Abstract class that provides a simple foundation for creating value objects that wrap a single string value
export abstract class StringValueObject {
	constructor(readonly value: string) {}
	toString(): string {
		return this.value;
	}
}
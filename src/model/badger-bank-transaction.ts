import faker from 'faker';

export class BadgerBankTransaction {

    private date: Date;
    private company: string;
    private amount: number;

    // Force static factory construction
    private constructor(date: Date, company: string, amount: number) {
        this.date = date;
        this.company = company;
        this.amount = amount;
     }

    public static constructRandom(): BadgerBankTransaction {
        // https://github.com/Marak/faker.js/issues/884 PR #887 will change faker.finance.amount to return a number, working around.
        return new BadgerBankTransaction(faker.date.past(), faker.company.companyName(), parseFloat(faker.finance.amount(0, 1000)));
    }

    public getDate(): Date {
        return this.date;
    }

    public getCompany(): string {
        return this.company;
    }

    public getAmount(): number {
        return this.amount;
    }
}

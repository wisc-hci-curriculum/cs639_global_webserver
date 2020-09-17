import { json } from "express";
import { BadgerBankTransaction } from "../badger-bank-transaction";

export class BadgerBankTransactionRequest {
    private amount: number;
    private transactions: Array<BadgerBankTransaction>;

    private static readonly REQ_LB = 0;
    private static readonly REQ_UB = 25;

    private static readonly DEF_AMOUNT = 0;

    public constructor(obj: any) {
        this.amount =  BadgerBankTransactionRequest.validateAmount(obj);
        this.transactions = [];
        for(let i = 0; i < this.amount; i++) {
            this.transactions.push(BadgerBankTransaction.constructRandom());
        }
    }

    public getAmount(amount: number) {
        return this.amount;
    }

    public getBadgerBankTransactions(): Array<BadgerBankTransaction> {
        return this.transactions;
    }

    private static validateAmount(amount: number): number {
        if(!amount) {
            return BadgerBankTransactionRequest.DEF_AMOUNT;
        } else {
            if(amount >= BadgerBankTransactionRequest.REQ_UB) {
                return BadgerBankTransactionRequest.REQ_UB;
            } else if (amount <= BadgerBankTransactionRequest.REQ_LB) {
                return BadgerBankTransactionRequest.REQ_LB;
            } else {
                return amount;
            }
        }
    }
}
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Account } from "./Account";
import { Transfer } from "./Transfer";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    transaction_id!: number;

    @ManyToOne(() => Account, (account) => account.transactions)
    account!: Account;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    date!: Date;

    @Column({ type: "decimal", precision: 19, scale: 2 })
    amount!: number;

    @Column({ type: "decimal", precision: 19, scale: 2 })
    balance!: number;

    @Column({ type: "varchar", length: 255 })
    transaction_type!: string; // enum: deposit, withdraw, transfer

}

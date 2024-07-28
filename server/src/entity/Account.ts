import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Transaction } from "./Transaction";

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    account_id!: number;

    @Column({ type: "varchar", length: 255 })
    account_number!: string;

    @Column({ type: "varchar", length: 255 })
    account_type!: string;

    @Column({ type: "decimal", precision: 19, scale: 2, default: 0.0 })
    balance!: number;

    @OneToMany(() => Transaction, (transaction) => transaction.account)
    transactions!: Transaction[];
}

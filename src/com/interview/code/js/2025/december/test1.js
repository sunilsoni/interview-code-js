import React, { useEffect, useState } from "react";
import { Transaction } from "../types/transaction";

interface TransactionTableProps {
    txns: Transaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ txns }) => {
    const [date, setDate] = useState("");
    const [rows, setRows] = useState<Transaction[]>(txns);

    useEffect(() => {
        setRows(txns);
    }, [txns]);

    const filter = () => {
        if (!date) return;
        setRows(txns.filter((t) => t.date === date));
    };

    const sort = () => {
        setRows((prev) => [...prev].sort((a, b) => a.amount - b.amount));
    };

    return (
        <div className="layout-column align-items-center mt-50">
            <section className="layout-row align-items-center justify-content-center">
                <label htmlFor="date" className="mr-10">
                    Transaction Date
                </label>
                <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    role="search"
                />
                <button onClick={filter}>Filter</button>
            </section>

            <table className="mt-10 table">
                <thead>
                <tr className="table">
                    <td className="table-header">Date</td>
                    <td className="table-header">Description</td>
                    <td className="table-header">Type</td>
                    <td className="table-header">
              <span id="amount" onClick={sort} role="button">
                Amount ($)
              </span>
                    </td>
                    <td className="table-header">Available Balance</td>
                </tr>
                </thead>
                <tbody>
                {rows.map((t, i) => (
                    <tr key={i}>
                        <td>{t.date}</td>
                        <td>{t.description}</td>
                        <td>{t.type === 1 ? "Debit" : "Credit"}</td>
                        <td>{t.amount}</td>
                        <td>{t.balance}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionTable;

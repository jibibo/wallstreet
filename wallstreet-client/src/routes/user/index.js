import { useState, useEffect, useContext } from "preact/hooks";
import { TransactionsContext } from "../../context/TransactionsContext";

import { Link } from 'preact-router/match';

import style from "./style.css";

const User = (props) => {
  const { id } = props;
  const [transactionUser, setTransactionUser] = useState(null);

  const { users } = useContext(TransactionsContext);

  useEffect(() => {
    const user = users.find((user) => user.id === parseInt(id));
    setTransactionUser(user);
    console.log(user)
  }, []);

  if (!transactionUser) return <h1>User not found</h1>;

  return (
    <div>
      <header>
        <Link href="/">
          <button className="button">{'< '} Go Back</button>
        </Link>
      </header>
      <div className={style.transactionsContainer}>
        <h1>{transactionUser.name}'s transactions</h1>
        {
          transactionUser.transactions.map((transaction) => (
            <div className={style.transaction}>
              <p>{transaction.description}</p>
              <p>{transaction.amount}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default User;
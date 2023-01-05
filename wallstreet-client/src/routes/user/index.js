import { useState, useEffect, useContext } from "preact/hooks";
import { TransactionsContext } from "../../context/TransactionsContext";

import { Link } from 'preact-router/match';

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
          <button className="button">Go Back</button>
        </Link>
      </header>
      <div>
        {
          transactionUser.transactions.map((transaction) => (
            <div>
              <h1>{transaction.description}</h1>
              <p>EUR {transaction.amount}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default User;
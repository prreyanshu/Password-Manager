import PasswordForm from '../components/PasswordForm';
import PasswordList from '../components/PasswordList';

const Home = () => {
  return (
    <div>
      <h1>Password Manager</h1>
      <PasswordForm />
      <PasswordList />
    </div>
  );
};

export default Home;

import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {

  async function connectWallet() {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log("accounts: ", accounts);
    setAccounts(accounts);
  }

  return (
    <div className={styles.container}>

      <Image
        src="/mmheader.png"
        width={100}
        height={100}
      ></Image>

      <button
        onClick={connectWallet}
        type="button"
        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
        Connect Wallet
      </button>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}

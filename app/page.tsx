import Image from 'next/image'
import styles from './page.module.css'
import {connectToDatabase} from '@/lib/db'
export default function Home() {
  connectToDatabase();
  return (
    <div className={styles.container}>
      <main className={styles.main}>
      </main>
    </div>
  )
}

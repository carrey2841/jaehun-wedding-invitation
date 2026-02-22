import { useState, useCallback } from 'react'
import { Section } from '../components/Section'
import { useInvitationStore } from '../stores/invitationStore'
import type { AccountInfo } from '../types/invitation'
import styles from './Accounts.module.css'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore
    }
  }, [text])
  return (
    <button
      type="button"
      className={styles.copyBtn}
      onClick={copy}
      aria-label="계좌번호 복사"
    >
      {copied ? '복사됨' : '복사'}
    </button>
  )
}

function AccountRow({ account }: { account: AccountInfo }) {
  const { relation, bankName, accountNumber } = account
  const hasInfo = bankName || accountNumber
  if (!relation && !hasInfo) return null
  return (
    <div className={styles.accountRow}>
      {relation && <div className={styles.relation}>{relation}</div>}
      {hasInfo && (
        <div className={styles.accountLineWrap}>
          <p className={styles.accountLine}>
            {[bankName, accountNumber].filter(Boolean).join(' ')}
          </p>
          {accountNumber && (
            <CopyButton text={accountNumber} />
          )}
        </div>
      )}
    </div>
  )
}

function FoldSection({
  title,
  accounts,
}: {
  title: string
  accounts: AccountInfo[]
}) {
  const [open, setOpen] = useState(false)
  const hasAny = accounts.some(
    (a) => a.bankName || a.accountHolder || a.accountNumber
  )
  return (
    <div className={styles.fold}>
      <button
        type="button"
        className={styles.foldHead}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <span className={styles.foldIcon}>{open ? '▼' : '▶'}</span>
      </button>
      {open && (
        <div className={styles.foldBody}>
          {hasAny ? (
            accounts.map((acc, i) => <AccountRow key={i} account={acc} />)
          ) : (
            <p className={styles.placeholder}>계좌 정보를 입력해 주세요.</p>
          )}
        </div>
      )}
    </div>
  )
}

export function Accounts() {
  const { accountsBySide } = useInvitationStore()
  const { groom, bride } = accountsBySide

  const defaultGroom: AccountInfo[] = [
    { relation: '신랑' },
    { relation: '신랑 아버지' },
    { relation: '신랑 어머니' },
  ]
  const defaultBride: AccountInfo[] = [
    { relation: '신부' },
    { relation: '신부 아버지' },
    { relation: '신부 어머니' },
  ]
  const groomList = groom?.length ? groom : defaultGroom
  const brideList = bride?.length ? bride : defaultBride

  return (
    <Section id="accounts" className={styles.accounts}>
      <h2 className={styles.heading}></h2>
      <FoldSection title="신랑 측 마음 전하실 곳" accounts={groomList} />
      <FoldSection title="신부 측 마음 전하실 곳" accounts={brideList} />
    </Section>
  )
}

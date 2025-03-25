"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { getSession, signOut } from "next-auth/react"
import styles from "../../styles/Admin.module.css"

export default function AdminDashboard() {
  const [donations, setDonations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalRaised, setTotalRaised] = useState(0)
  const [memberStats, setMemberStats] = useState([])
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const session = await getSession()
      if (!session) {
        router.replace("/admin/login")
      } else {
        fetchDonations()
      }
    }

    checkAuth()
  }, [router])

  async function fetchDonations() {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/donations")
      const data = await response.json()

      if (data.donations) {
        setDonations(data.donations)

        // Calculate total raised
        const total = data.donations.reduce((sum, donation) => {
          return donation.status === "completed" ? sum + Number.parseFloat(donation.amount) : sum
        }, 0)
        setTotalRaised(total)

        // Calculate member stats
        const memberMap = {}
        data.donations.forEach((donation) => {
          if (donation.status === "completed") {
            if (!memberMap[donation.memberCredited]) {
              memberMap[donation.memberCredited] = {
                name: donation.memberCredited,
                total: 0,
                count: 0,
              }
            }
            memberMap[donation.memberCredited].total += Number.parseFloat(donation.amount)
            memberMap[donation.memberCredited].count += 1
          }
        })

        const stats = Object.values(memberMap).sort((a, b) => b.total - a.total)
        setMemberStats(stats)
      }
    } catch (error) {
      console.error("Error fetching donations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.adminDashboard}>
      <header className={styles.adminHeader}>
        <h1>Alice in Greekland Admin Dashboard</h1>
        <button onClick={() => signOut()} className={styles.signOutButton}>
          Sign Out
        </button>
      </header>

      <div className={styles.dashboardStats}>
        <div className={styles.statCard}>
          <h2>Total Raised</h2>
          <p className={styles.statValue}>${totalRaised.toFixed(2)}</p>
        </div>

        <div className={styles.statCard}>
          <h2>Total Donations</h2>
          <p className={styles.statValue}>{donations.filter((d) => d.status === "completed").length}</p>
        </div>
      </div>

      <div className={styles.dashboardContent}>
        <div className={styles.memberLeaderboard}>
          <h2>Member Leaderboard</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Member</th>
                  <th>Amount Raised</th>
                  <th>Donations</th>
                </tr>
              </thead>
              <tbody>
                {memberStats.map((member, index) => (
                  <tr key={member.name}>
                    <td>{index + 1}</td>
                    <td>{member.name}</td>
                    <td>${member.total.toFixed(2)}</td>
                    <td>{member.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className={styles.recentDonations}>
          <h2>Recent Donations</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Donor</th>
                  <th>Amount</th>
                  <th>Member Credited</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id}>
                    <td>{new Date(donation.timestamp).toLocaleDateString()}</td>
                    <td>{donation.donorName}</td>
                    <td>${Number.parseFloat(donation.amount).toFixed(2)}</td>
                    <td>{donation.memberCredited}</td>
                    <td>{donation.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}


# NeoDesk

A decentralized metaverse platform for remote work, skills verification, and collaboration, powered by smart contracts on the Stacks blockchain.

## Overview

NeoDesk provides a tokenized virtual workspace economy that combines professional collaboration, verifiable skill credentials, and automated payments in a fully decentralized metaverse. It consists of **seven core smart contracts** that manage identity, virtual offices, job posting, and on-chain work transactions.

### Core Smart Contracts

1. **Identity & Reputation Contract** – Manages user profiles, skill credentials (as NFTs), and reputation scores.
2. **Workspace NFT Contract** – Handles ownership and customization of virtual office NFTs within the metaverse.
3. **Job Posting & Matching Contract** – Facilitates decentralized job postings and candidate matching.
4. **Skill NFT Contract** – Issues verifiable, soulbound NFTs for validated skills and achievements.
5. **Escrow & Payment Contract** – Automates milestone-based payments with crypto escrow and dispute resolution.
6. **DAO Governance Contract** – Enables token-holder voting on platform upgrades, dispute arbitration, and policy decisions.
7. **Asset Marketplace Contract** – Allows trading of metaverse office assets, avatars, and productivity tools.

---

## Features

- **Decentralized professional identity and skill verification**
- **Tokenized virtual offices and workspaces**
- **On-chain job posting and hiring**
- **Automated crypto escrow payments**
- **DAO-driven governance and dispute resolution**
- **NFT marketplace for virtual office assets**
- **Low-fee transactions via Stacks (Clarity smart contracts)**

---

## Smart Contracts

### **Identity & Reputation Contract**
- Registers user profiles with wallet-linked identities
- Maintains reputation scores based on completed work
- Integrates skill NFTs for verified credentials

### **Workspace NFT Contract**
- Issues dynamic NFTs representing virtual offices
- Supports office upgrades and branding customization
- Enables renting or selling office spaces

### **Job Posting & Matching Contract**
- Decentralized job posting board
- Automated skill-based candidate filtering
- Supports task-based or long-term project hiring

### **Skill NFT Contract**
- Soulbound NFTs for verified skills (non-transferable)
- Issued by partner DAOs, educators, or peer endorsements
- Proof-of-skill mechanism for job matching

### **Escrow & Payment Contract**
- Milestone-based payment locking and release
- DAO-managed dispute arbitration
- Supports multi-token payment (STX and SIP-010 tokens)

### **DAO Governance Contract**
- Community-driven proposals and voting
- On-chain dispute arbitration for job/payment conflicts
- Upgradeable governance framework

### **Asset Marketplace Contract**
- Buy, sell, and trade VR office assets
- Monetize custom office furniture, branding tools, or avatars
- Royalty support for digital asset creators

---

## Installation

1. Install [Clarinet CLI](https://docs.hiro.so/clarinet)
2. Clone this repository:
   ```bash
   git clone https://github.com/your-org/neodesk.git
   cd neodesk
3. Run tests:
```bash
npm test
```
4. Deploy contracts:

```bash
clarinet deploy
```

## Usage

- Each smart contract can be deployed independently and interacted with using the Stacks blockchain.
- Refer to the documentation in the /contracts directory for function details, parameters, and transaction flows.

## Testing

Tests are written using Clarinet’s testing suite.
Run all tests with:
```bash
npm test
```

## License

MIT License

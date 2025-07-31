import { describe, it, expect, beforeEach } from "vitest"

const mockContract = {
  admin: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  lastWorkspaceId: 0,
  workspaces: new Map<number, any>(),

  isAdmin(caller: string) {
    return caller === this.admin
  },

  mint(caller: string, recipient: string, size: string, rentPrice: number, royalty: number) {
    if (caller !== this.admin) return { error: 100 } // ERR-NOT-AUTHORIZED
    this.lastWorkspaceId++
    this.workspaces.set(this.lastWorkspaceId, {
      owner: recipient,
      uri: `https://neodesk.io/workspaces/${this.lastWorkspaceId}`,
      size,
      rentPrice,
      isRented: false,
      renter: null,
      royaltyPercentage: royalty,
    })
    return { value: this.lastWorkspaceId }
  },

  rent(caller: string, id: number) {
    const ws = this.workspaces.get(id)
    if (!ws) return { error: 102 } // ERR-WORKSPACE-NOT-FOUND
    if (ws.isRented) return { error: 103 } // ERR-ALREADY-RENTED
    ws.isRented = true
    ws.renter = caller
    return { value: true }
  },

  endRental(caller: string, id: number) {
    const ws = this.workspaces.get(id)
    if (!ws) return { error: 102 }
    if (!ws.renter) return { error: 104 }
    if (ws.renter !== caller) return { error: 100 }
    ws.isRented = false
    ws.renter = null
    return { value: true }
  },

  upgradeSize(caller: string, id: number, newSize: string) {
    const ws = this.workspaces.get(id)
    if (!ws) return { error: 102 }
    if (ws.owner !== caller) return { error: 101 }
    if (ws.size === newSize) return { error: 105 }
    ws.size = newSize
    return { value: true }
  },

  transfer(caller: string, id: number, newOwner: string) {
    const ws = this.workspaces.get(id)
    if (!ws) return { error: 102 }
    if (ws.owner !== caller) return { error: 101 }
    ws.owner = newOwner
    return { value: true }
  },

  transferAdmin(caller: string, newAdmin: string) {
    if (caller !== this.admin) return { error: 100 }
    this.admin = newAdmin
    return { value: true }
  },
}

describe("Workspace NFT Contract", () => {
  beforeEach(() => {
    mockContract.admin = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
    mockContract.lastWorkspaceId = 0
    mockContract.workspaces = new Map()
  })

  it("should allow admin to mint a workspace", () => {
    const result = mockContract.mint(
      mockContract.admin,
      "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG",
      "small",
      50,
      5
    )
    expect(result).toEqual({ value: 1 })
    expect(mockContract.workspaces.get(1).owner).toBe("ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG")
  })

  it("should allow a user to rent a workspace", () => {
    mockContract.mint(mockContract.admin, "ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP", "medium", 100, 10)
    const result = mockContract.rent("ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG", 1)
    expect(result).toEqual({ value: true })
    expect(mockContract.workspaces.get(1).isRented).toBe(true)
  })

  it("should prevent renting an already rented workspace", () => {
    mockContract.mint(mockContract.admin, "ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP", "medium", 100, 10)
    mockContract.rent("ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG", 1)
    const result = mockContract.rent("ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG", 1)
    expect(result).toEqual({ error: 103 })
  })

  it("should allow owner to upgrade workspace size", () => {
    mockContract.mint(mockContract.admin, "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG", "small", 50, 5)
    const result = mockContract.upgradeSize("ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG", 1, "large")
    expect(result).toEqual({ value: true })
    expect(mockContract.workspaces.get(1).size).toBe("large")
  })

  it("should allow admin transfer", () => {
    const result = mockContract.transferAdmin(
      "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG"
    )
    expect(result).toEqual({ value: true })
    expect(mockContract.admin).toBe("ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG")
  })
})

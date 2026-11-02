// Payment sở hữu cả Contract, Deposit và Dispute; đây chỉ là type, chưa có API adapter.
export type ContractStatus = 'CREATED' | 'PENDING_DEPOSIT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type DepositStatus =
  'PENDING' | 'LOCKED' | 'RELEASABLE' | 'RELEASED' | 'FORFEITED' | 'REFUNDED';

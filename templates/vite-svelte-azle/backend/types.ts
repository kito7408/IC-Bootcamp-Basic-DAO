import {
    Record,
    Vec,
    Principal,
    text,
    Variant,
    nat,
    nat64,
    float32,
    blob,
    Opt,
} from "azle";

export type Tokens = { amount_e8s: nat };

export type User = Record<{
    id: Principal;
    username: string;
    tokens: Tokens;
}>;

export type ProposalId = nat;

export type ProposalPayload = Record<{
    // position: Record<{ lat: float32; lng: float32 }>;
    // description: string;

    method: string;
    canister_id: Principal;
    message: blob;
}>;

export type Proposal = Record<{
    // id: nat;
    // timestamp: nat64;
    // votes_yes_e8s: nat;
    // votes_no_e8s: nat;

    // voters: Vec<Principal>;
    // state: ProposalState;
    // proposer: Principal;
    // payload: ProposalPayload;


    id: nat;
    votes_no: Tokens;
    voters: Vec<Principal>;
    state: ProposalState;
    timestamp: nat;
    proposer: Principal;
    votes_yes: Tokens;
    payload: ProposalPayload;
}>;

export type ProposalState = Variant<{
    // A failure occurred while executing the proposal
    Failed: text;
    // The proposal is open for voting
    Open: null;
    // The proposal is currently being executed
    Executing: null;
    // Enough "no" votes have been cast to reject the proposal, and it will not be executed
    Rejected: null;
    // The proposal has been successfully executed
    Succeeded: null;
    // Enough "yes" votes have been cast to accept the proposal, and it will soon be executed
    Accepted: null;
}>;

export type UpdateSystemParamsPayload = Record<{
    transfer_fee: Tokens;
    proposal_vote_threshold: Tokens;
    proposal_submission_deposit: Tokens;
}>;

export type Vote = Variant<{ no: null; yes: null }>;
export type VoteArgs = Record<{ vote: Vote; proposal_id: nat }>;

export type SystemParams = Record<{
    transfer_fee: Tokens;

    // The amount of tokens needed to vote "yes" to accept, or "no" to reject, a proposal
    proposal_vote_threshold: Tokens;

    // The amount of tokens that will be temporarily deducted from the account of
    // a user that submits a proposal. If the proposal is Accepted, this deposit is returned,
    // otherwise it is lost. This prevents users from submitting superfluous proposals.
    proposal_submission_deposit: Tokens;
}>;

//Not sure if it's necesary
export type BasicDaoStableStorage = Record<{
    accounts: [User];
    proposals: [Proposal];
    system_params: SystemParams;
  }>;

//   public func proposal_key(t: Nat) : Trie.Key<Nat> = { key = t; hash = Int.hash t };
//   public func account_key(t: Principal) : Trie.Key<Principal> = { key = t; hash = Principal.hash t };
//   public func accounts_fromArray(arr: [Account]) : Trie.Trie<Principal, Tokens> {
//       var s = Trie.empty<Principal, Tokens>();
//       for (account in arr.vals()) {
//           s := Trie.put(s, account_key(account.owner), Principal.equal, account.tokens).0;
//       };
//       s
//   };
//   public func proposals_fromArray(arr: [Proposal]) : Trie.Trie<Nat, Proposal> {
//       var s = Trie.empty<Nat, Proposal>();
//       for (proposal in arr.vals()) {
//           s := Trie.put(s, proposal_key(proposal.id), Nat.equal, proposal).0;
//       };
//       s
//   };
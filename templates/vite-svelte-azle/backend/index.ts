import { $query, $update, Record, StableBTreeMap, Principal, Opt, Vec, Tuple } from 'azle';

type User = Record<{
    id: Principal;
    username: string;
}>;


// import type {
//     User,
//     ProposalId,
//     Proposal,
//     ProposalPayload,
//     BasicDaoStableStorage,
//     ProposalState,
//     SystemParams,
//     Tokens,
//     UpdateSystemParamsPayload,
//     Vote,
//     VoteArgs
// } from "./types";

const usersDB = new StableBTreeMap<Principal, User>(0, 1_000, 10_000);

$update
export function setUser(id: string, name: string): void {
    let principalId = Principal.fromText(id);
    let userToAdd: User = {
        id: principalId,
        username: name
    };
    let isertOpt = usersDB.insert(principalId, userToAdd);
}

$query
export function getUserByPrincipal(key: Principal): Opt<User> {
    return usersDB.get(key);
}

$query
export function getItems(): Vec<Tuple<[Principal, User]>> {
    return usersDB.items();
}

$query
export function getValues(): Vec<User> {
    return usersDB.values();
}
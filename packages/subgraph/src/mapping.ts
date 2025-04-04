import {
    Approval as ApprovalEvent,
    GreetingChange as GreetingChangeEvent,
    OwnershipTransferred as OwnershipTransferredEvent,
    Transfer as TransferEvent,
} from "../generated/YourToken/YourToken";
import {
    Approval,
    GreetingChange,
    OwnershipTransferred,
    Transfer,
} from "../generated/schema";

export function handleApproval(event: ApprovalEvent): void {
    let entity = new Approval(
        event.transaction.hash.concatI32(event.logIndex.toI32())
    );
    entity.owner = event.params.owner;
    entity.spender = event.params.spender;
    entity.value = event.params.value;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
}

export function handleGreetingChange(event: GreetingChangeEvent): void {
    let entity = new GreetingChange(
        event.transaction.hash.concatI32(event.logIndex.toI32())
    );
    entity.greetingSetter = event.params.greetingSetter;
    entity.newGreeting = event.params.newGreeting;
    entity.premium = event.params.premium;
    entity.value = event.params.value;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
}

export function handleOwnershipTransferred(
    event: OwnershipTransferredEvent
): void {
    let entity = new OwnershipTransferred(
        event.transaction.hash.concatI32(event.logIndex.toI32())
    );
    entity.previousOwner = event.params.previousOwner;
    entity.newOwner = event.params.newOwner;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
}

export function handleTransfer(event: TransferEvent): void {
    let entity = new Transfer(
        event.transaction.hash.concatI32(event.logIndex.toI32())
    );
    entity.from = event.params.from;
    entity.to = event.params.to;
    entity.value = event.params.value;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
}

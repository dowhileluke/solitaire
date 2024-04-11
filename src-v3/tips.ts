import { GameKey } from './games2'

const COMMON_1 = 'To maintain options, leave the final card of a tableau pile in place unless the empty space can be used immediately.'
const COMMON_2 = 'Despite some risk in doing so, it may become necessary to move just two suits to the foundations rather than developing evenly.'
const COMMON_3 = 'An empty space can be used to enable movement of large stacks or as a spot to deposit a sequence blocking important cards underneath.'
const COMMON_4 = 'Prioritize moving lots of cards in a single suit to their foundation instead of digging for every Ace.'
const COMMON_5 = 'The first priority is to create an open space. That space should then be used to organize the remaining piles while opening up a different or additional space.'

const klondike = [
`The hidden goal of this game is to reveal all the face down cards, otherwise too many moves may become impossible.
It is virtually always correct to uncover a new card if the move does not require using a card from the deck.`,

`Most of the strategy comes down to manipulating cards in the stock pile.
Early cards in each fresh deal will remain accessible on the next deal as long as cards that came before remain undisturbed.
Thus, it is best to prioritize card moves toward the very end of a deal.`,

COMMON_1,
]

const westcliff = [
`With only one pass through the deck, there is not a lot of decision making to be done.
Most available moves simply have to be taken.
Reveal as many face down cards as possible and hope for the best!`,

COMMON_1
]

const easthaven = [
`Most of the skill in this game is empty space management.
If an empty space cannot be formed within ~2 deals the game is likely doomed.`,

`An ideal use of an empty space is to fix multiple tangled stacks while leaving a new empty space left over.
Another great use is to reveal a new card in a pile that is likely to become empty soon.
Otherwise, it is still valuable to use the space to help get the remaining piles in better order.`,

`When dealing, some judgment is required whether or not an empty space is likely to be reopened after being filled by a random card.
If no other piles are in good shape, it is often better to leave the space open before dealing.`,

COMMON_2,
]

const klondike2 = [
`The addition of two extra piles means that stock manipulation is much less necessary compared to single-deck Klondike.
Most moves can be made without much worry.
It is still advisable to prioritize moves that do not use cards from the deck.`
]

const spider = [
`Prioritize moves using high ranked cards first.
The revealed card beneath might change how the low ranked cards should be approached.`,

`Whenever possible, build sequences in a matching suit because they have the most flexible movement.
The more mixed a sequence becomes, the more difficult it becomes to rearrange later, and virtually impossible without an open space.`,

`In order to keep revealing cards and clearing out spaces, accept that some piles will become incredibly messy and left for later in the game.
Only organize the cards in these piles if it can be done without sacrificing an open space, or right before dealing.`,

`Because of the dealing procedure, some piles will become excessively difficult to use, like an Ace stacked on another Ace.
Rather than trying to remedy the pile, it can be better to leave it alone and use the next dealt card as a base to build on.`,

`When filling empty spaces before a deal, consider how many cards are left in the deck that help reopen the space.
For example, a 5432 sequence is very likely to be movable soon if all the 6s are yet to be seen.`,

`Always avoid putting Kings into empty spaces because they can never be moved to another pile.`,
]

const freecell = [
`Try to uncover Aces early in order to start reducing the number of cards in play.`,

`Look for opportunities to clear an entire tableau column. ` + COMMON_3,
]

const bakers = [
`Aim to open up an empty space in a way that requires few free cells, two is a good rule of thumb. ` + COMMON_3,

COMMON_4,
]

const seahaven = [
`Begin by looking for ways to empty the initially filled cells to enable complex plays.`,

`Avoid stacking ~3 or more cards of a given suit on top of any lower ranked cards of the same suit, unless there is no other choice.
Six or more cards stacked like this will become impossible to untangle.`,
	
COMMON_4,

COMMON_1,
]

const forecell = [
`Aim to form pure sequences with no other cards beneath, ideally using a King as the base.
Until such sequences are possible, look for piles of relatively unimportant cards to build sequences upon.`,

`Free cells are absolutely vital for success and should be opened whenever possible.
Even without many open cells, long sequences can sometimes be moved in small pieces.`,

`Aces should be somewhat prioritized when deciding which piles to dig into.`,
]

const yukon = [
`This game is a balancing act of uncovering cards while avoiding the creation of stacks that are impossible to detangle.
For example, placing a stack containing a red 9 on top of a stack containing a black 8. 
There is a second red 9 in the deck so this is not necessarily impossible to fix, just difficult.`,

COMMON_1,

COMMON_2,
]

const beleaguered = [
COMMON_5,

`Because Kings cannot be moved before a space is open, the card directly on top of a King is often an excellent place to start adding cards from other piles.`,

`Early on, identify which types of cards are mostly locked behind Kings, then unpack piles that will not need to use those cards.`,
]

const fortress = [
COMMON_5
]

const canister = [
`When forming sequences, use high or low cards as the base, and build toward the middle ranks.
This will result in many accessible middle rank cards, which can be shuffled around while picking up stray cards.
Eventually a space will open up, and a King-headed sequence can be inverted twice to drop into the opening.`,

`Keep in mind that a King-headed sequence can still be inverted back to the tableau if another King needs the open space.`,

`Many late game scenarios can be solved by skill alone, so making an early merci move is often useful or outright required.`,
]

const thieves = [
`This game mostly requires luck, but some skillful play is still possible.
Emptying the tableau is the main objective because the other cards can be moved there later.`,

`Be wary of adding a card to the tableau if another copy already exists there. 
It is likely that only one copy can be moved to the foundations, while the other locks everything behind it.	`,
]

const alibaba = [
`Until an empty space is opened, very little strategy is required. 
Simply make every available move with full confidence. 
After a space opens up, rearrange the remaining piles so an empty space is always left behind.`,
]

export const TIP_COMPENDIUM: Partial<Record<GameKey, string[]>> = {
	klondike,
	westcliff,
	easthaven,
	klondike2,
	easthaven2: easthaven,
	spider,
	spiderette: spider,
	will: spider,
	freecell,
	bakers,
	seahaven,
	forecell,
	yukon,
	beleaguered,
	fortress,
	alleys: beleaguered,
	canister,
	thieves,
	eight: thieves,
	alibaba,
}

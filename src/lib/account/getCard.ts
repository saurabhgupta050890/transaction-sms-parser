import { combinedWords } from '../constants';
import { IAccountInfo, IAccountType } from '../interface';
import { getMatchedCombindedWord } from '../utils';

function getCard(message: string[]): IAccountInfo {
  let combinedCardName = null;
  const cardIndex = message.findIndex(
    (word) =>
      word.includes('card') ||
      combinedWords
        .flatMap((x) => x) // Any combined word of card type
        .filter((w) => w.type === IAccountType.CARD)
        .some((w) => {
          if (w.word === word) {
            combinedCardName = w.word;
            return true;
          }
          return false;
        })
  );
  const card: IAccountInfo = { type: null, name: null, number: null };

  // Search for "card" and if not found return empty obj
  if (cardIndex !== -1) {
    const combinedWord = getMatchedCombindedWord(message);
    card.name = combinedWord.word;
    card.number = message[cardIndex + 1];
    card.type = IAccountType.CARD;

    // If the data is false positive
    // return empty obj
    // Else return the card info
    if (Number.isNaN(Number(card.number))) {
      return {
        type: combinedCardName ? card.type : null,
        name: combinedCardName,
        number: null,
      };
    }
    return card;
  }
  return { type: null, name: null, number: null };
}

export default getCard;

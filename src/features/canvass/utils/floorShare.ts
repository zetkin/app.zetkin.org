export type FloorShareResponse = 'no' | 'yes' | null;

export type FloorShareHousehold = {
  responses: FloorShareResponse[];
};

export type FloorShare = {
  floor: number;
  households: FloorShareHousehold[];
  questions: string[];
  recentlyVisited: boolean[];
  successMask: number;
};

export function formatFloorShareHouseholdName(
  floor: number,
  householdIndex: number
): string {
  return `${String(floor).padStart(2, '0')}${String(householdIndex).padStart(
    2,
    '0'
  )}`;
}

export function encodeFloorShare(share: FloorShare): string {
  if (share.questions.length > 4) {
    throw new Error('Floor shares support at most four questions');
  }

  const bytes = share.households.map(({ responses }) =>
    responses.reduce(
      (packed, response, index) =>
        packed | (encodeResponse(response) << (index * 2)),
      0
    )
  );

  const encodedQuestions = encodeBase64Url(
    Array.from(new TextEncoder().encode(share.questions.join('\0')))
  );

  const recentBytes = packFlags(share.recentlyVisited);

  // Format: floor, packed responses, UTF-8 questions, success mask, recent flags.
  return `${share.floor}.${encodeBase64Url(bytes)}.${encodedQuestions}.${share.successMask.toString(36)}.${encodeBase64Url(recentBytes)}`;
}

export function decodeFloorShare(value: string): FloorShare | null {
  const [
    floorValue,
    encodedResponses,
    encodedQuestions,
    successMaskValue = '0',
    encodedRecentlyVisited = '',
  ] = value.split('.');
  const floor = Number(floorValue);
  const successMask = Number.parseInt(successMaskValue, 36);

  if (
    !Number.isInteger(floor) ||
    !encodedResponses ||
    !encodedQuestions ||
    !Number.isInteger(successMask) ||
    successMask < 0 ||
    successMask > 15 ||
    !encodedRecentlyVisited
  ) {
    return null;
  }

  const bytes = decodeBase64Url(encodedResponses);
  if (!bytes) {
    return null;
  }

  const recentBytes = decodeBase64Url(encodedRecentlyVisited);
  if (!recentBytes) {
    return null;
  }

  const questionBytes = decodeBase64Url(encodedQuestions);
  if (!questionBytes) {
    return null;
  }

  const questions = new TextDecoder()
    .decode(new Uint8Array(questionBytes))
    .split('\0');
  if (questions.length > 4) {
    return null;
  }

  return {
    floor,
    households: bytes.map((packed) => ({
      responses: Array.from({ length: questions.length }, (_, index) =>
        decodeResponse((packed >> (index * 2)) & 0b11)
      ),
    })),
    questions,
    recentlyVisited: bytes.map(
      (_, index) => !!(recentBytes[Math.floor(index / 8)] & (1 << (index % 8)))
    ),
    successMask,
  };
}

function encodeResponse(response: FloorShareResponse): number {
  return response === null ? 0 : response === 'no' ? 1 : 2;
}

function decodeResponse(value: number): FloorShareResponse {
  return value === 0 ? null : value === 1 ? 'no' : value === 2 ? 'yes' : null;
}

function packFlags(flags: boolean[]): number[] {
  const bytes = Array.from({ length: Math.ceil(flags.length / 8) }, () => 0);

  flags.forEach((flag, index) => {
    if (flag) {
      bytes[Math.floor(index / 8)] |= 1 << (index % 8);
    }
  });

  return bytes;
}

// Encode UTF-8 bytes as URL-safe Base64 in both browser and server contexts.
function encodeBase64Url(bytes: number[]): string {
  const alphabet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result = '';

  for (let index = 0; index < bytes.length; index += 3) {
    const byte0 = bytes[index];
    const byte1 = bytes[index + 1] ?? 0;
    const byte2 = bytes[index + 2] ?? 0;
    const combined = (byte0 << 16) | (byte1 << 8) | byte2;

    result += alphabet[(combined >> 18) & 0x3f];
    result += alphabet[(combined >> 12) & 0x3f];
    if (index + 1 < bytes.length) {
      result += alphabet[(combined >> 6) & 0x3f];
    }
    if (index + 2 < bytes.length) {
      result += alphabet[combined & 0x3f];
    }
  }

  return result;
}

function decodeBase64Url(value: string): number[] | null {
  const alphabet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const bytes: number[] = [];
  let buffer = 0;
  let bits = 0;

  for (const character of value) {
    const digit = alphabet.indexOf(character);
    if (digit < 0) {
      return null;
    }

    buffer = (buffer << 6) | digit;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((buffer >> bits) & 0xff);
    }
  }

  return bytes;
}

/*
 * Copyright (c) Outright Mental. (https://outrightmental.com) All Rights Reserved.
 */

export const
    MILLIS_PER_SECOND = 1000,
    TICKS_PER_SECOND = 4,
    GAME_DAYS_PER_SECOND = 1;

export const
    MESSAGES_DISPLAY_LIMIT = 24,
    MESSAGES_STORAGE_LIMIT = 9999;

export const MONEY = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    roundingType: 'compactRounding',
    notation: 'compact',
    compactDisplay: 'short',
});

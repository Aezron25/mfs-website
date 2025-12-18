
'use client';

import { EventEmitter } from 'events';

// It's important to use a single instance of the emitter throughout the app
// to ensure that events are correctly propagated.
class ErrorEmitter extends EventEmitter {}

export const errorEmitter = new ErrorEmitter();

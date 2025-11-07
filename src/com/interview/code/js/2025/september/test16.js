// cryptoDetails.js
// Minimal, self-contained CryptoDetails component.
// Purpose: fetch crypto details when dialog opens, show description,
// and call GET /close_event when user closes the dialog (tests expect that).

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material';
import React from 'react';
import axios from 'axios';

// API base used to fetch details for a currency by id.
// Keep this value (tests/mock server may rely on it).
export const API_URL_DETAILS = 'https://example.com/api/cryptos?id=';

// Exported component (props must remain the same)
export default function CryptoDetails({ open, handleClose, currency }) {
    // response holds the fetched details (or error message object)
    const [response, setResponse] = React.useState(null);

    // getData: fetch details for the selected currency id
    const getData = async () => {
        if (!currency || !currency.id) return; // guard
        try {
            // fetch details; set response.data or null
            const res = await axios.get(API_URL_DETAILS + currency.id);
            setResponse(res.data || null);
        } catch (err) {
            // On fetch failure show friendly message expected by tests
            setResponse({ description: 'Try again' });
        }
    };

    // Effect: run when dialog opens or when selected currency changes.
    // - When open && currency.id => fetch details
    // - When dialog closes => clear previous response
    React.useEffect(() => {
        if (open && currency && currency.id) {
            setResponse(null); // reset while loading
            getData();
        } else if (!open) {
            // clear when dialog closed so reopening triggers fresh state
            setResponse(null);
        }
        // dependencies: re-run when 'open' changes or when currency id changes
    }, [open, currency && currency.id]);

    // onCloseClicked: call GET /close_event (tests expect a GET request)
    // If GET succeeds -> call parent handleClose to clear dialog state.
    // If GET fails -> display "Try again" message inside dialog (as tests expect).
    const onCloseClicked = async () => {
        try {
            await axios.get('/close_event');
            setResponse(null);
            // Inform parent to clear its openedCurrency and close the dialog locally.
            // (Parent should not make its own network call — we've done the GET here.)
            handleClose();
        } catch (err) {
            // show the expected failure message inside dialog
            setResponse({ description: 'Try again' });
        }
    };

    return (
        <Dialog open={open} maxWidth="sm">
            {/* Title uses the currency name if present */}
            <DialogTitle>{currency?.name}</DialogTitle>

            <DialogContent>
                {/* show the fetched description (or "Try again" if error) */}
                <DialogContentText>{response?.description}</DialogContentText>
            </DialogContent>

            <DialogActions>
                {/* Close button now triggers the GET /close_event then calls handleClose */}
                <Button onClick={onCloseClicked} autoFocus>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

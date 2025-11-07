// Orders.js (only change shown — prefer context.orders when present)

import {
    List,
    ListSubheader,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import React from 'react';
import { LocalShipping } from '@mui/icons-material';
import Context from './context';

// Do not change export signature
export default function Orders({ orders = [] }) {
    const context = React.useContext(Context);

    // prefer orders supplied by the context when present
    const listToRender = (context && Array.isArray(context.orders) && context.orders.length)
        ? context.orders
        : orders;

    return (
        <List sx={{ maxWidth: 400 }} data-testid="orders">
            <ListSubheader>Orders</ListSubheader>
            {listToRender.map((order) => (
                <ListItem key={order.id}>
                    <ListItemIcon>
                        <LocalShipping />
                    </ListItemIcon>
                    <ListItemText primary={`OrderID: ${order.id}, Description: ${order.comment}`} />
                </ListItem>
            ))}
        </List>
    );
}

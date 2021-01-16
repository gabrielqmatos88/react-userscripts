import React from 'react';
import If from './If';
import classnames from 'classnames';

export const MenuItem = ({ item }) => {
    const { action} = item;
    const handleAction = (e) => {
        // just execute self click action
        e.stopPropagation();
        if (action !== undefined) {
            action();
        }
    };
    return (
        <li className={classnames({ 'has-sub': item.items && item.items.length })} onClick={handleAction}><a className={classnames({ 'has-action': action !== undefined })}>{ item.label }</a>
            <If condition={ item.items && item.items.length }>
                <ul>
                    { item.items?.map( subItem => <MenuItem item={subItem} key={subItem.id}></MenuItem>) }
                </ul>
            </If>
        </li>
    );
};

const Menu = ({ items, children }) => {
    return (
        <div className="navigation">
            <ul>
                { items.map(item => <MenuItem item={item} key={item.id }></MenuItem> )}
            </ul>
        </div>
    );
}

export default Menu;
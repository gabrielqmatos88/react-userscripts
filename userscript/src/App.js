import React, { useEffect, useState } from 'react';
import './App.css';
import $ from 'jquery';

const parseMovie = (elem ,isSerie) => {
  const cells = $(elem).parents('tr').find('td');
  const legendado = /legendado/i.test($($(elem).parents('table').find('th > strong')).text());
  return {
    href: $(elem).attr('href'),
    text: $(elem).text().trim(),
    res: $(cells[0]).text().trim(),
    format: $(cells[3]).text().trim(),
    cinema: /cinema/i.test($(cells[4]).text()),
    size: $(cells[2]).text().trim(),
    legendado: legendado,
    isSerie: isSerie
  };
};

const parseSerie = (elem ,isSerie) => {
  const cells = $(elem).parents('tr').find('td');
  const legendado = /legendado/i.test($($(elem).parents('table').find('th > strong')).text());
  return {
    href: $(elem).attr('href'),
    text: $(elem).text().trim(),
    res: $(cells[1]).text().trim(),
    format: $(cells[4]).text().trim(),
    cinema: false,
    size: $(cells[3]).text().trim(),
    epName: $(cells[0]).text().trim(),
    legendado: legendado,
    isSerie: isSerie
  };
};

const parseLinks = () => {
  const tmpLinks = [];
  $('a').each((i, elem) => {
    if (/magnet:/i.test($(elem).attr('href'))) {
      const isSerie = !/baixar filme:/i.test($('.entry-content').text());
      console.log('isSerie', isSerie);
      const parseFn = isSerie ? parseSerie: parseMovie;
      tmpLinks.push(parseFn(elem, isSerie));
    }
  });
  console.log('tmpLinks', tmpLinks);
  return tmpLinks.sort( (a, b) => {
    if (!a.isSerie) {
      return a.cinema - b.cinema;
    } else {
      return a.epName - b.epName;
    }
  });
};

function App() {
  const [links, setLinks] = useState([]);
  useEffect(() => {
   setLinks(parseLinks());
  }, []);
  return (
    <div className="App">
      <div className='alternative-download'>
        <h2>Tabela de downloads</h2>
      { links.map((link, i ) => {
          let itemClass = 'alternative-download-info' + (link.cinema ? ' cinema' : '');
          return (
          <div className={itemClass} key={i + 1}>
            { link.isSerie ? <span>{link.epName}</span>  : null }
            <span>{link.res}</span>
            <span>{link.format}</span>
            { !link.isSerie ? <span><b>Cinema:</b> { link.cinema ? 'Sim' : 'Não' }</span>  : null }
            <span>{ link.size  }</span>
            <span>{ link.legendado ? 'LEG' : 'DUB'  }</span>
            <span><a href={link.href} target='_blank' rel="noopener noreferrer">{link.text}</a></span>
          </div>);
        })}
      </div>
    </div>
  );
}

export default App;

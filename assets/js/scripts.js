const { useState }   = React;
const { createRoot } = ReactDOM;

// Base colors object definition
const baseColors = {
    blue:    '#0d6efd',
    sky:     '#0ea5e9',
    cyan:    '#0dcaf0',
    indigo:  '#6610f2',
    purple:  '#6f42c1',
    violet:  '#8b5cf6',
    pink:    '#d63384',
    rose:    '#e11d48',
    red:     '#dc3545',
    orange:  '#fd7e14',
    amber:   '#f59e0b',
    yellow:  '#ffc107',
    lime:    '#84cc16',
    green:   '#198754',
    emerald: '#10b981',
    teal:    '#20c997',
    slate:   '#64748b',
    zinc:    '#71717a',
    neutral: '#737373',
    stone:   '#78716c',
    gray:    '#6c757d',
    black:   '#000000',
    white:   '#ffffff',
};

const defaultThemeColors = {
    primary:        '#0d6efd',
    secondary:      '#6c757d',
    success:        '#198754',
    info:           '#0dcaf0',
    warning:        '#ffc107',
    danger:         '#dc3545',
    light:          '#f8f9fa',
    dark:           '#212529',
    'primary-bg':   '#ffffff',
    'secondary-bg': '#f8f9fa',
    'tertiary-bg':  '#e9ecef',
    'gradient-1':   { start: '#4f46e5', end: '#0ea5e9' },
    'gradient-2':   { start: '#8b5cf6', end: '#d946ef' },
    'gradient-3':   { start: '#06b6d4', end: '#3b82f6' },
};

function ColorPaletteGenerator() {
    const [ showCSS, setShowCSS ]           = useState( false );
    const [ showHTML, setShowHTML ]         = useState( false );
    const [ copiedColor, setCopiedColor ]   = useState( '' );
    const [ themeColors, setThemeColors ]   = useState( defaultThemeColors );
    const [ activeTheme, setActiveTheme ]   = useState( null );
    const [ gradientEdit, setGradientEdit ] = useState( {
        name:     null,
        position: null
    } );

    const generateShades = ( baseColor ) => {
        const hex2HSL = ( hex ) => {
            let r = parseInt( hex.slice( 1, 3 ), 16 ) / 255;
            let g = parseInt( hex.slice( 3, 5 ), 16 ) / 255;
            let b = parseInt( hex.slice( 5, 7 ), 16 ) / 255;

            let max     = Math.max( r, g, b );
            let min     = Math.min( r, g, b );
            let h, s, l = ( max + min ) / 2;

            if ( max === min ) {
                h = s = 0;
            } else {
                let d = max - min;
                s     = l > 0.5 ? d / ( 2 - max - min ) : d / ( max + min );
                switch ( max ) {
                    case r:
                        h = ( g - b ) / d + ( g < b ? 6 : 0 );
                        break;
                    case g:
                        h = ( b - r ) / d + 2;
                        break;
                    case b:
                        h = ( r - g ) / d + 4;
                        break;
                }
                h /= 6;
            }

            return [ h * 360, s * 100, l * 100 ];
        };

        const HSL2hex = ( h, s, l ) => {
            s /= 100;
            l /= 100;
            const k       = n => ( n + h / 30 ) % 12;
            const a       = s * Math.min( l, 1 - l );
            const f       = n => l - a * Math.max( -1, Math.min( k( n ) - 3, Math.min( 9 - k( n ), 1 ) ) );
            const rgb2hex = ( r, g, b ) =>
                '#' + [ r, g, b ].map( x =>
                    Math.round( x * 255 ).toString( 16 ).padStart( 2, '0' )
                ).join( '' );
            return rgb2hex( f( 0 ), f( 8 ), f( 4 ) );
        };

        const [ h, s, l ] = hex2HSL( baseColor );
        const shades      = {};

        for ( let i = 1; i <= 18; i++ ) {
            const step = i * 50;
            if ( step <= 900 ) {
                const lightness = Math.min( 95, Math.max( 5, l + ( 10 - i ) * 5 ) );
                shades[ step ]  = HSL2hex( h, s, lightness );
            }
        }

        return shades;
    };

    const isLightColor = ( color ) => {
        const hex = color.replace( '#', '' );
        const r   = parseInt( hex.slice( 0, 2 ), 16 );
        const g   = parseInt( hex.slice( 2, 4 ), 16 );
        const b   = parseInt( hex.slice( 4, 6 ), 16 );
        return ( 0.299 * r + 0.587 * g + 0.114 * b ) / 255 > 0.5;
    };

    const copyToClipboard = ( text ) => {
        navigator.clipboard.writeText( text );
        setCopiedColor( text );
        setTimeout( () => setCopiedColor( '' ), 2000 );
    };

    const generateHTML = () => {
        return '<div class="container">\n' +
            '\t<h1>Color System Example</h1>\n' +
            '\n' +
            '\t<h2>Theme Colors</h2>\n' +
            '\t<div class="grid">\n' +
            '\t\t<div class="color-block cl-bg-primary">primary</div>\n' +
            '\t\t<div class="color-block cl-bg-secondary">secondary</div>\n' +
            '\t\t<div class="color-block cl-bg-success">success</div>\n' +
            '\t\t<div class="color-block cl-bg-danger">danger</div>\n' +
            '\t\t<div class="color-block cl-bg-warning">warning</div>\n' +
            '\t\t<div class="color-block cl-bg-info">info</div>\n' +
            '\t\t<div class="color-block cl-bg-light">light</div>\n' +
            '\t\t<div class="color-block cl-bg-dark">dark</div>\n' +
            '\t</div>\n' +
            '\n' +
            '\t<h2>Backgrounds</h2>\n' +
            '\t\t<div class="color-block cl-bg-primary-bg">primary-bg</div>\n' +
            '\t\t<div class="color-block cl-bg-secondary-bg">secondary-bg</div>\n' +
            '\t\t<div class="color-block cl-bg-tertiary-bg">tertiary-bg</div>\n' +
            '\n' +
            '\t<h2>Gradients</h2>\n' +
            '\t<div class="gradient-block cl-bg-gradient-1">gradient-1</div>\n' +
            '\t<div class="gradient-block cl-bg-gradient-2">gradient-2</div>\n' +
            '\t<div class="gradient-block cl-bg-gradient-3">gradient-3</div>\n' +
            '</div>';
    };
    const generateCSS  = () => {
        let css = ':root {\n';

        // Add base colors and their shades
        Object.entries( baseColors ).forEach( ( [ name, color ] ) => {
            css += `  --cl-${name}: ${color};\n`;
            const shades = generateShades( color );
            Object.entries( shades ).forEach( ( [ shade, value ] ) => {
                css += `  --cl-${name}-${shade}: ${value};\n`;
            } );
        } );

        // Add theme colors
        Object.entries( themeColors )
            .filter( ( [ name ] ) => !name.startsWith( 'gradient' ) )
            .forEach( ( [ name, color ] ) => {
                css += `  --cl-${name}: ${color};\n`;
            } );

        // Add gradients
        Object.entries( themeColors )
            .filter( ( [ name ] ) => name.startsWith( 'gradient' ) )
            .forEach( ( [ name, gradient ] ) => {
                css += `  --cl-${name}: linear-gradient(to right, ${gradient.start}, ${gradient.end});\n`;
            } );

        css += '}\n\n';

        // Add utility classes
        Object.entries( baseColors ).forEach( ( [ name ] ) => {
            css += `.cl-${name} { color: var(--cl-${name}); }\n`;
            css += `.cl-bg-${name} { background-color: var(--cl-${name}); }\n`;
            for ( let i = 1; i <= 18; i++ ) {
                const shade = i * 50;
                if ( shade <= 900 ) {
                    css += `.cl-${name}-${shade} { color: var(--cl-${name}-${shade}); }\n`;
                    css += `.cl-bg-${name}-${shade} { background-color: var(--cl-${name}-${shade}); }\n`;
                }
            }
        } );

        Object.entries( themeColors )
            .filter( ( [ name ] ) => !name.startsWith( 'gradient' ) )
            .forEach( ( [ name ] ) => {
                css += `.cl-${name} { color: var(--cl-${name}); }\n`;
                css += `.cl-bg-${name} { background-color: var(--cl-${name}); }\n`;
            } );

        Object.keys( themeColors )
            .filter( name => name.startsWith( 'gradient' ) )
            .forEach( name => {
                css += `.cl-bg-${name} { background: var(--cl-${name}); }\n`;
            } );

        return css;
    };

    const handleColorSelect = ( color ) => {
        console.log( 'Color selected:', color );
        console.log( 'Gradient edit state:', gradientEdit );

        if ( gradientEdit.name && gradientEdit.position ) {
            console.log( `Updating gradient ${gradientEdit.name} ${gradientEdit.position} to ${color}` );
            setThemeColors( prev => {
                // Create new gradient colors
                const updatedGradient = {
                    ...prev[ gradientEdit.name ],
                    [ gradientEdit.position ]: color
                };

                // Create new theme colors with updated gradient
                const newColors = {
                    ...prev,
                    [ gradientEdit.name ]: updatedGradient
                };

                console.log( 'Updated theme colors:', newColors );
                return newColors;
            } );

            // Reset gradient edit state
            setGradientEdit( { name: null, position: null } );
            return;
        }

        if ( activeTheme ) {
            setThemeColors( prev => ( {
                ...prev,
                [ activeTheme ]: color
            } ) );
            setActiveTheme( null );
            return;
        }

        copyToClipboard( color );
    };

    return (
        <div className="container">
            <h1>Color Palette Generator</h1>

            <div className="section">
                <button className="button" onClick={() => setShowCSS( !showCSS )}>
                    {showCSS ? 'Hide' : 'Show'} CSS
                </button>
                <button style={{ marginLeft: '5px' }} className="button" onClick={() => setShowHTML( !showHTML )}>
                    {showHTML ? 'Hide' : 'Show'} HTML Example
                </button>
            </div>

            <div className="instructions">
                {gradientEdit.name
                 ? `Select a color to set the ${gradientEdit.position || 'start/end'} color of "${gradientEdit.name}"`
                 : activeTheme
                   ? `Select a color to set the "${activeTheme}" theme color`
                   : "Click any theme color to modify it, or click any color below to copy its hex value"}
            </div>

            {showCSS && (
                <div className="section">
                    <div style={{ position: 'relative' }}>
                            <pre className="code-block">
                                <code>{generateCSS()}</code>
                            </pre>
                        <button
                            className="button"
                            style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
                            onClick={() => copyToClipboard( generateCSS() )}
                        >
                            Copy CSS
                        </button>
                    </div>
                </div>
            )}

            {showHTML && (
                <div className="section">
                    <div style={{ position: 'relative' }}>
                            <pre className="code-block">
                                <code>{generateHTML()}</code>
                            </pre>
                        <button
                            className="button"
                            style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
                            onClick={() => copyToClipboard( generateHTML() )}
                        >
                            Copy HTML
                        </button>
                    </div>
                </div>
            )}
            <div className="section">
                <h2>Theme Colors</h2>
                <div className="grid grid-cols-4">
                    {Object.entries( themeColors )
                        .filter( ( [ name ] ) => !name.startsWith( 'gradient' ) )
                        .map( ( [ name, color ] ) => (
                            <div
                                key={name}
                                className={`color-block ${activeTheme === name ? 'selected' : ''}`}
                                style={{ backgroundColor: color }}
                                onClick={() => {
                                    setActiveTheme( activeTheme === name ? null : name );
                                    setGradientEdit( { name: null, position: null } );
                                }}
                            >
                                <div style={{ color: isLightColor( color ) ? 'black' : 'white' }}>
                                    <span className="font-mono text-sm">
                                        {name}<br />{color}
                                    </span>
                                </div>
                                {activeTheme === name && (
                                    <div className="copied-overlay">
                                        <span style={{ color: 'white' }}>EDITING</span>
                                    </div>
                                )}
                            </div>
                        ) )}
                </div>

                <div className="grid grid-cols-1 mt-4">
                    <h3 className="mb-0">Gradients</h3>
                    <p className="mt-0">Click the HEX value to edit the start or end color</p>
                    {Object.entries( themeColors )
                        .filter( ( [ name ] ) => name.startsWith( 'gradient' ) )
                        .map( ( [ name, gradient ] ) => (
                            <div key={name} className="gradient-block">
                                <div
                                    className={`gradient-display ${gradientEdit.name === name ? 'selected' : ''}`}
                                    style={{
                                        background: `linear-gradient(to right, ${gradient.start}, ${gradient.end})`
                                    }}
                                >
                                    <div style={{ color: isLightColor( gradient.start ) ? 'black' : 'white' }}>
                                        <span className="font-mono text-sm">
                                            {name}
                                            <br />
                                            <div className="gradient-colors">
                                                <span
                                                    className="gradient-color-btn"
                                                    onClick={( e ) => {
                                                        e.stopPropagation();
                                                        setGradientEdit( {
                                                            name:     name,
                                                            position: 'start'
                                                        } );
                                                        setActiveTheme( null );
                                                    }}
                                                    style={{
                                                        background: gradient.start,
                                                        color:      isLightColor( gradient.start ) ? 'black' : 'white'
                                                    }}
                                                >
                                                    {gradient.start}
                                                </span>
                                                {'>'}
                                                <span
                                                    className="gradient-color-btn"
                                                    onClick={( e ) => {
                                                        e.stopPropagation();
                                                        setGradientEdit( {
                                                            name:     name,
                                                            position: 'end'
                                                        } );
                                                        setActiveTheme( null );
                                                    }}
                                                    style={{
                                                        background: gradient.end,
                                                        color:      isLightColor( gradient.end ) ? 'black' : 'white'
                                                    }}
                                                >
                                                    {gradient.end}
                                                </span>
                                            </div>
                                        </span>
                                    </div>
                                    {gradientEdit.name === name && (
                                        <div className="copied-overlay">
                                            <span style={{ color: 'white' }}>
                                                {gradientEdit.position
                                                 ? `Select ${gradientEdit.position} color`
                                                 : 'Click start or end color to edit'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) )}
                </div>
            </div>

            <div className="section">
                <h2>Base Colors with Shades</h2>
                {Object.entries( baseColors ).map( ( [ name, color ] ) => (
                    <div key={name} className="mb-4">
                        <h3>{name}</h3>
                        <div className="grid grid-cols-9">
                            {Object.entries( generateShades( color ) ).map( ( [ shade, shadeColor ] ) => (
                                <div
                                    key={`${name}-${shade}`}
                                    className="color-block"
                                    style={{ backgroundColor: shadeColor }}
                                    onClick={() => handleColorSelect( shadeColor )}
                                >
                                    <div style={{ color: isLightColor( shadeColor ) ? 'black' : 'white' }}>
                                        <span className="font-mono text-sm">
                                            {name}{shade && `-${shade}`}
                                            <br />
                                            {shadeColor}
                                        </span>
                                    </div>
                                    {copiedColor === shadeColor && !activeTheme && !gradientEdit.name && (
                                        <div className="copied-overlay">
                                            <span style={{ color: 'white' }}>Copied!</span>
                                        </div>
                                    )}
                                </div>
                            ) )}
                        </div>
                    </div>
                ) )}
            </div>
        </div>
    );
}

// Create root and render
const container = document.getElementById( 'root' );
const root      = createRoot( container );
root.render( <ColorPaletteGenerator /> );
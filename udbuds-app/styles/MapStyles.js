import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: { flex: 1, minHeight: 120, backgroundColor: '#E8EDE7' },
    webview: { flex: 1, backgroundColor: '#E8EDE7' },
    overlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#F6F2EAF2' },
    message: { color: '#53616D', textAlign: 'center', fontSize: 15, lineHeight: 22, marginTop: 12 },
});

// CSS til kortet inde i WebView. Holdes adskilt fra kortets logik.
export const mapCss = `
html, body, #map { height:100%; width:100%; margin:0; background:#E8EDE7; }
.leaflet-container { font-family:system-ui,sans-serif; }
.task-pin { background:#2E7D73; color:white; border:3px solid white; border-radius:50%;
  box-shadow:0 2px 8px #17324D33; display:flex; align-items:center; justify-content:center;
  font-size:15px; font-weight:700; box-sizing:border-box; }
.task-pin.selected { background:#17324D; }
.profile-pin { border:3px solid white; border-radius:50%; box-shadow:0 1px 5px #17324D44; box-sizing:border-box; }
.profile-pin.customer { background:#17324D; }
.profile-pin.company { background:#CC8425; }
.leaflet-control-attribution { font-size:10px; }
.leaflet-control-attribution a { color:#17324D; }
`;

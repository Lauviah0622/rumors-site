import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import initStoryshots, {
  multiSnapshotWithOptions,
} from '@storybook/addon-storyshots';
import { createSerializer } from 'enzyme-to-json';
import MockDate from 'mockdate';

Enzyme.configure({ adapter: new Adapter() });

/* makeStyle + useStyle hook, <Box> and withStyle HOC */
const MAKE_STYLE_REGEXP = /((?:makeStyles|MuiBox|Component)-.+?)-\d+/g;

function removeMaterialUIInternals(json) {
  // Remove Portal containerInfo
  if (json.type === 'Portal') {
    return {
      ...json,
      props: {
        ...json.props,
        containerInfo: undefined,
      },
    };
  }

  // Remove all props of these components
  if (['Transition', 'TrapFocus'].includes(json.type)) {
    return {
      ...json,
      props: {},
    };
  }

  // Skip HOC components (single children) or excessive wrapper
  if (
    json.type.match(
      /^(ForwardRef|WithStyles|ThemeProvider|Styled|MockedProvider|ApolloProvider)/
    )
  ) {
    // When skipping HOC or wrapper, the first children are usually setups (such as <CssBaseline>),
    // we should ignore together
    return (
      json.children &&
      removeMaterialUIInternals(json.children[json.children.length - 1])
    );
  }

  // Remove makeStyle className serial numbers
  if (json.props?.className?.match(MAKE_STYLE_REGEXP)) {
    json = {
      ...json,
      props: {
        ...json.props,
        className: json.props.className.replace(MAKE_STYLE_REGEXP, '$1'),
      },
    };
  }

  return json;
}
MockDate.set('2020-01-01');
initStoryshots({
  test: arg => {
    multiSnapshotWithOptions({
      renderer: mount,
    })(arg);
  },
  snapshotSerializers: [createSerializer({ map: removeMaterialUIInternals })],
});
MockDate.reset();

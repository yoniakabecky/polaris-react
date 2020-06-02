import React from 'react';

import {TextContainer} from '../TextContainer';
import {UnstyledLink} from '../UnstyledLink';
import {Subheading} from '../Subheading';
import {Thumbnail} from '../Thumbnail';
import {Button} from '../Button';
import {Stack} from '../Stack';
import {Card} from '../Card';
import {AppProvider} from '../AppProvider';

import styles from './CustomCard.scss';

export interface CustomCardProps {
  /** Title content for the card */
  title?: React.ReactNode;
}

export const CustomCard: React.FunctionComponent<CustomCardProps> = ({
  title,
}: CustomCardProps) => {
  return (
    <AppProvider
      i18n={{}}
      theme={{
        colorScheme: 'dark',
        colors: {
          surface: '#020c1d',
          secondary: '#103560',
          interactive: '#009973',
        },
      }}
      features={{newDesignLanguage: true}}
    >
      <Card title={title}>
        <Card.Section>
          <TextContainer spacing="loose">
            <Subheading>Unfulfilled</Subheading>
          </TextContainer>
          <Stack alignment="center">
            <Stack.Item>
              <Thumbnail
                source="https://burst.shopifycdn.com/photos/black-leather-choker-necklace_373x@2x.jpg"
                alt="Black choker necklace"
              />
            </Stack.Item>
            <Stack.Item fill>
              <div className={styles.interactiveLink}>
                <UnstyledLink url="https://help.shopify.com/manual">
                  Enamel pin
                </UnstyledLink>
              </div>
            </Stack.Item>
            <Stack.Item>$9.99</Stack.Item>
          </Stack>
        </Card.Section>
        <Card.Section>
          <Stack alignment="center">
            <Stack.Item fill>
              <p>Buy postage and ship 2 items</p>
            </Stack.Item>
            <Stack.Item>
              <Button>Continue</Button>
            </Stack.Item>
          </Stack>
        </Card.Section>
      </Card>
    </AppProvider>
  );
};

import React from 'react';

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
          <Stack vertical spacing="tight">
            <Stack.Item>
              <Subheading>Unfulfilled</Subheading>
            </Stack.Item>
            <Stack.Item>
              <Stack alignment="center">
                <Stack.Item>
                  <div className={styles.productThumbnail}>
                    <Thumbnail
                      source="https://cdn.shopify.com/s/files/1/0262/2521/3462/products/liverpool-2_1296x.png?v=1590081855"
                      alt="Liverpool kit"
                    />
                  </div>
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
            </Stack.Item>
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
